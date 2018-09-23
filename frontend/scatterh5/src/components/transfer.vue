<template>
  <div class="transfer">
    <div class="sendBox">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="account" prop="account">
          <el-input v-model="ruleForm.account" placeholder="account"></el-input>
        </el-form-item>
        <el-form-item label="amount" prop="amount">
          <el-input v-model="ruleForm.amount" placeholder="amount">
            <i slot="suffix" class="">TSL</i>
          </el-input>
        </el-form-item>
        <el-form-item label="memo" prop="memo">
          <el-input v-model="ruleForm.memo" placeholder="memo"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">send</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>



export default {
  name: 'transfer',
  data () {
    return {
      ruleForm: {
        account: '',
        amount: '',
        memo: '',
      },
      rules: {
        account: [
          { required: true, message: 'account', min: 1, trigger: 'blur' }
        ],
        amount: [
          { required: true, message: 'amount', min: 1, trigger: 'blur' }
        ],
        memo: [
          { required: true, message: 'memo', min: 1, trigger: 'blur' }
        ],
      },
    }
  },
  mounted () {

  },
  methods: {
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
          const account = scatter.identity.accounts.find(x => x.blockchain === 'eos' && x.authority === 'active');
          const eosOptions = { expireInSeconds:60 };
          const eos = scatter.eos(network, this.$Eos, eosOptions);
          const transactionOptions = { authorization:[`${account.name}@${account.authority}`] };
          // 转账
          eos.contract('tokenshields').then(contract => {
            contract.transfer(account.name, this.ruleForm.account, this.ruleForm.amount+'.0000'+' TSL', '转账', transactionOptions).then(res => {
              console.log(res);
              if (res.transaction_id) {
                this.$message.success('success')
                this.ruleForm = {}
              }
              this.transaction_id = res.transaction_id
            }).catch(error => {
              console.log(JSON.parse(error).error.details[0].message);
              this.$message({
                showClose: true,
                message: JSON.parse(error).error.details[0].message,
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
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.transfer{
  margin-top: 50px;
}
</style>
