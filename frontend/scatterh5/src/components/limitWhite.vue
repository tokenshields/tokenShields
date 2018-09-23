<template>
  <div class="limitWhite">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="Limitation" name="1">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="limitation" prop="limitation">
            <el-input v-model="ruleForm.limitation" placeholder="limitation">
              <i slot="suffix" class="">TSL</i>
            </el-input>
          </el-form-item>
          <el-form-item label="time span" prop="range">
            <el-input v-model="range" placeholder="Day"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" class="confirm">confirm</el-button>
          </el-form-item>
        </el-form>        
      </el-tab-pane>
      <el-tab-pane label="White List" name="2">
        <el-button type="primary" icon="el-icon-plus" @click="addWhite" class="addWhiteBox"> add account</el-button>
        <el-table :data="whiteList" style="width: 100%">
          <el-table-column type="index" label="No." min-width="80"></el-table-column>
          <el-table-column prop="account" label="Account" min-width="40"></el-table-column>
          <el-table-column label="Operation" min-width="40">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" plain @click="deleteWhite(scope.row)">remove</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialog">
      <el-form :model="accountruleForm" :rules="accountrules" ref="accountruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="account" prop="account">
          <el-input v-model="accountruleForm.account" placeholder="account"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="config('accountruleForm')">add</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>



export default {
  name: 'limitWhite',
  data () {
    return {
      whiteList: [],
      transaction_id: '',
      activeName: '1',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now();
        },
      },
      range: '',
      ruleForm: {
        limitation: '',
        range: '',
      },
      rules: {
        limitation: [
          { required: true, message: 'limitation', min: 1, trigger: 'blur' }
        ],
        range: [
          { required: true, message: 'range', min: 1, trigger: 'blur' }
        ],
      },
      accountruleForm: {
        account: '',
      },
      accountrules: {
        account: [
          { required: true, message: 'account', min: 1, trigger: 'blur' }
        ],
      },
      dialog: false,
    }
  },
  watch: {
    range () {
      console.log(this.range)
      this.ruleForm.range = String(this.range)
    },
  },
  mounted () {
    this.getWhiteList()
  },
  methods: {
    getWhiteList () {
      this.$axios.post('/get_table_rows',{
        code: "tokenshields",
        json: true,
        limit: -1,
        lower_bound: "",
        scope: sessionStorage.getItem('accountName'),
        table: "accounts",
        table_key: "",
        upper_bound: ""
      })
      .then((res) => {
        console.log(res.rows[0].whitelist)
        console.log(res)
        let arr = []
        res.rows[0].whitelist.forEach(ele => {
          let obj = {
            account: ele,
          }
          arr.push(obj)
        });
        this.whiteList = arr
        console.log(arr)
      })
      .catch((err) => {
        console.log(err)
      })
    },
    addWhite () {
      this.dialog = true
      this.accountruleForm = {}
    },
    handleClick(tab, event) {

    },
    changeDate () {
      console.log(range)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getUserScatter()
        }
        else {
          return false
        }
      })
    },
    config (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getAccountUserScatter()
        }
        else {
          return false
        }
      })
    },
    getUserScatter () {
      const host = '127.0.0.1:50005';
      const socket = new WebSocket(`ws://${host}/socket.io/?EIO=3&transport=websocket`);
      const network = {
        blockchain:'eos',
        protocol:'http',
        host:'api.eossweden.se',
        port:80,
        chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
      }
      // First we need to connect to the user's Scatter.
      this.$ScatterJS.scatter.connect('My App').then((connected) => {
        console.log(connected);
        if(!connected) {
          return false;
        }
        const scatter = this.$ScatterJS.scatter;
        const requiredFields = { accounts:[network] };
        scatter.getIdentity(requiredFields).then((res) => {
          const account = scatter.identity.accounts.find(x => x.blockchain === 'eos' && x.authority === 'owner');
          const eosOptions = { expireInSeconds:60 };
          const eos = scatter.eos(network, this.$Eos, eosOptions);
          const transactionOptions = { authorization:[`${account.name}@${account.authority}`] };
          // 设置转账限制
          eos.contract('tokenshields').then(contract => {
            contract.setlimit(account.name, this.ruleForm.limitation+" TSL", this.range*86000, transactionOptions).then(res => {
              console.log(res);
              if (res.transaction_id) {
                this.$message.success('success')
                this.ruleForm = {}
                this.range = ''
              }
              this.transaction_id = res.transaction_id
            }).catch(error => {
              console.log(error);
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 0,
              });
            });
          });
        }).catch(error => {
          console.error(error);
          this.$message({
            showClose: true,
            message: 'permisson not right ! please switch to other key(owner or active)',
            type: 'error',
            duration: 0,
          });
        });
      });
    },
    getAccountUserScatter () {
      const host = '127.0.0.1:50005';
      const socket = new WebSocket(`ws://${host}/socket.io/?EIO=3&transport=websocket`);
      const network = {
        blockchain:'eos',
        protocol:'http',
        host:'api.eossweden.se',
        port:80,
        chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
      }
      // First we need to connect to the user's Scatter.
      this.$ScatterJS.scatter.connect('My App').then((connected) => {
        console.log(connected);
        if(!connected) {
          return false;
        }
        const scatter = this.$ScatterJS.scatter;
        const requiredFields = { accounts:[network] };
        scatter.getIdentity(requiredFields).then((res) => {
          const account = scatter.identity.accounts.find(x => x.blockchain === 'eos' && x.authority === 'owner');
          const eosOptions = { expireInSeconds:60 };
          const eos = scatter.eos(network, this.$Eos, eosOptions);
          const transactionOptions = { authorization:[`${account.name}@${account.authority}`] };
          // 设置白名单
          eos.contract('tokenshields').then(contract => {
            contract.addwhitelist(account.name, "1.0000 TSL", this.accountruleForm.account, transactionOptions).then(res => {
              console.log(res);
              if (res.transaction_id) {
                this.$message.success('success')
                this.getWhiteList()
                this.dialog = false
              }
              this.transaction_id = res.transaction_id
            }).catch(error => {
              console.log(error);
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 0,
              });
            });
          });
        }).catch(error => {
          console.error(error);
          this.$message({
            showClose: true,
            message: 'permisson not right ! please switch to other key(owner or active)',
            type: 'error',
            duration: 0,
          });
        });
      });
    },
    removeUserWhite (name) {
      const host = '127.0.0.1:50005';
      const socket = new WebSocket(`ws://${host}/socket.io/?EIO=3&transport=websocket`);
      const network = {
        blockchain:'eos',
        protocol:'http',
        host:'api.eossweden.se',
        port:80,
        chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
      }
      // First we need to connect to the user's Scatter.
      this.$ScatterJS.scatter.connect('My App').then((connected) => {
        console.log(connected);
        if(!connected) {
          return false;
        }
        const scatter = this.$ScatterJS.scatter;
        const requiredFields = { accounts:[network] };
        scatter.getIdentity(requiredFields).then((res) => {
          const account = scatter.identity.accounts.find(x => x.blockchain === 'eos' && x.authority === 'owner');
          const eosOptions = { expireInSeconds:60 };
          const eos = scatter.eos(network, this.$Eos, eosOptions);
          const transactionOptions = { authorization:[`${account.name}@${account.authority}`] };
          // 移除白名单
          eos.contract('tokenshields').then(contract => {
            contract.rmwhitelist(account.name, "1.0000 TSL", name, transactionOptions).then(res => {
              console.log(res);
              if (res.transaction_id) {
                this.$message.success('success')
                this.getWhiteList()
              }
              this.transaction_id = res.transaction_id
            }).catch(error => {
              console.log(JSON.parse(error));
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 0,
              });
            });
          });
        }).catch(error => {
          console.error(error);
          this.$message({
            showClose: true,
            message: 'permisson not right ! please switch to other key(owner or active)',
            type: 'error',
            duration: 0,
          });
        });
      });
    },
    deleteWhite (item) {
      console.log(item)
      this.removeUserWhite(item.account)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.limitWhite{
  margin-top: 50px;
  .confirm{
    float: right;
    margin-top: 60px;
  }
  .addWhiteBox{
    margin-bottom: 42px;
  }
  .block{
    text-align: left;
  }
}
</style>
