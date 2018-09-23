<template>
  <div class="login">
    用户请先行下载 Scatter 客户端 (桌面版 or 谷歌插件))
  </div>
</template>

<script>



export default {
  name: 'login',
  data () {
    return {

    }
  },
  mounted () {

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
          console.log(res);
          const account = scatter.identity.accounts.find(x => x.blockchain === 'eos' && x.authority === 'owner');
          console.log(account)
          const eosOptions = { expireInSeconds:60 };
          const eos = scatter.eos(network, this.$Eos, eosOptions);
          const transactionOptions = { authorization:[`${account.name}@${account.authority}`] };
          // 设置转账限制
          // eos.contract('tokenshields').then(contract => {
          //   contract.setlimit(account.name, "1.0000 TSL", 10, transactionOptions).then(res => {
          //     console.log(res);
          //     console.log('设置成功');
          //     console.log('Transaction ID: '+res.transaction_id);
          //   }).catch(error => {
          //     console.log(error);
          //   });
          // });
          // 设置白名单
          // eos.contract('tokenshields').then(contract => {
          //   contract.addwhitelist(account.name, "1.0000 TSL", "oraclechengj", transactionOptions).then(res => {
          //     console.log(res);
          //     console.log('添加白名单');
          //     console.log('Transaction ID: '+res.transaction_id);
          //   }).catch(error => {
          //     console.log(error);
          //   });
          // });
          // 移除白名单
          // eos.contract('tokenshields').then(contract => {
          //   contract.rmwhitelist(account.name, "1.0000 TSL", "oraclechengj", transactionOptions).then(res => {
          //     console.log(res);
          //     console.log('移除白名单');
          //     console.log('Transaction ID: '+res.transaction_id);
          //   }).catch(error => {
          //     console.log(error);
          //   });
          // });
          // 转账
          // eos.contract('tokenshields').then(contract => {
          //   contract.transfer(account.name, 'herochenlian', '0.0001 TSL', '转账', transactionOptions).then(res => {
          //     console.log(res);
          //     console.log('转账成功');
          //     console.log('Transaction ID: '+res.transaction_id);
          //   }).catch(error => {
          //     console.log(error);
          //   });
          // });
        }).catch(error => {
          console.error(error);
        });
      });
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.login{
  text-align: center;
  font-size: 18px;
  color: #333333;
}
</style>
