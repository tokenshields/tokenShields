<template>
  <div class="setlimt">
    <i class="el-icon-d-arrow-left" @click="goback"></i>
    <br />
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="limitation" name="1">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="limitation" prop="limitation">
            <el-input v-model="ruleForm.limitation" placeholder="limitation"></el-input>
          </el-form-item>
          <el-form-item label="time span" prop="range">
            <div class="block">
              <el-date-picker
                v-model="range"
                change="changeDate"
                type="datetime"
                value-format="timestamp"
                :picker-options="pickerOptions"
                placeholder="datetime">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">confirm</el-button>
          </el-form-item>
        </el-form>        
      </el-tab-pane>
      <el-tab-pane label="White Lists" name="2">
        <el-button type="primary" icon="el-icon-plus" @click="addWhite">add account</el-button>
        <el-table :data="whiteList" style="width: 100%">
          <el-table-column type="index" label="No." min-width="80"></el-table-column>
          <el-table-column prop="account" label="Account" min-width="40"></el-table-column>
          <el-table-column label="Operation" min-width="40">
            <template slot-scope="scope">
              <el-button type="info" icon="el-icon-delete" @click="deleteWhite(scope.row)">remove</el-button>
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
          <el-button type="primary" @click="config('accountruleForm')">config</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>



export default {
  name: 'setlimt',
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
    goback () {
      this.$router.push('index')
    },
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
            contract.setlimit(account.name, this.ruleForm.limitation+" TSL", (this.range-new Date().getTime()), transactionOptions).then(res => {
              console.log(res);
              if (res.transaction_id) {
                this.$message.success('success')
              }
              this.transaction_id = res.transaction_id
            }).catch(error => {
              console.log(error);
            });
          });
        }).catch(error => {
          console.error(error);
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
            });
          });
        }).catch(error => {
          console.error(error);
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
              console.log(error);
            });
          });
        }).catch(error => {
          console.error(error);
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
.setlimt{
  .el-icon-d-arrow-left{
    cursor: pointer;
  }
}
</style>
