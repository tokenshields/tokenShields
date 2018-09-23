<template>
  <div class="account">
    <div class="box">
      <span class="name">account</span>
      <br />
      <span class="num">{{accounts.name}}</span>
    </div>
    <div class="box">
      <span class="name">balance</span>
      <br />
      <span class="num">{{balance}}</span>
    </div>
  </div>
</template>

<script>



export default {
  name: 'account',
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
          this.$message.error(error);
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
        if (res.length == 0) {
          this.balance = '0 TSL'
        }
      })
      .catch((err) => {
        console.log(err)
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.account{
  width: 100%;
  height: auto;
  .box{
    width: 100%;
    height: 140px;
    padding: 0% 20px;
    border-bottom: 1px solid  #E8E8E8;
    .name{
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #222222;
      letter-spacing: 0;
      margin: 40px 0 8px 0;
      display: inline-block;
    }
    .num{
      font-family: PingFangSC-Medium;
      font-size: 22px;
      color: #222222;
      letter-spacing: 0;
      font-weight: bold;
    }
  }
}
</style>
