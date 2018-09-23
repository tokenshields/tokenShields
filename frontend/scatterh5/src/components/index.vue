<template>
  <div class="index">
    <div class="headBox">
      <div>
        <el-tag type="success">account:</el-tag>{{accounts.name}}
        <br />
        <el-tag type="success">balance:</el-tag>{{balance}}
      </div>
      <div>
        <el-button type="primary" @click="gotoset">settings</el-button>
      </div>
    </div>
    <div class="transfer">
      <el-button type="primary" @click="gotoSend">transfer</el-button>
    </div>
  </div>
</template>

<script>



export default {
  name: 'index',
  data () {
    return {
      accounts: {},
      balance: '',
    }
  },
  watch: {
    accounts () {
      this.getUserBalance()
    },
  },
  mounted () {
    this.getUserScatter()
  },
  methods: {
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
          this.$router.push('login');
          return false;
        }
        const scatter = this.$ScatterJS.scatter;
        const requiredFields = { accounts:[network] };
        scatter.getIdentity(requiredFields).then((res) => {
          this.accounts = res.accounts[0]
          sessionStorage.setItem('accountName',this.accounts.name)
          console.log(res.accounts[0]);
        }).catch(error => {
          console.error(error);
        });
      });
    },
    getUserBalance () {
      this.$axios.post('/get_currency_balance',{
        account: this.accounts.name,
        code: 'tokenshields',
        symbol: 'TSL',
      })
      .then((res) => {
        console.log(res)
        this.balance = res[0]
      })
      .catch((err) => {
        console.log(err)
      })
    },
    gotoset () {
      this.$router.push('setlimt')
    },
    gotoSend () {
      this.$router.push('send')
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.index{
  width: 100%;
  height: auto;
  .headBox{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .transfer{
    text-align: center;
    margin-top: 20px;
  }
}
</style>
