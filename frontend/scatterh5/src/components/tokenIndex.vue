<template>
  <div class="tokenIndex">
    <el-container>
      <el-header>
        <div class="headBox">
          <div class="tokenName">TokenShields</div>
          <div class="userName">
            <img src="../assets/images/logo.png" alt="" class="imgBox">
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>



export default {
  name: 'tokenIndex',
  data () {
    return {
      accountsName: {},
    }
  },
  mounted () {
    this.geUsertName()
  },
  methods: {
    geUsertName () {
      this.accountsName = sessionStorage.getItem('accountName')
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.tokenIndex{
  .imgBox{
    width: 40px;
  }
  .el-header, .el-footer {
    background: #597EF7;
    height: 65px;
    text-align: center;
  }
  
  .el-main {
    background: #F0F2F5;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  .headBox{
    width: 900px;
    height: 65px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    .tokenName{
      color: #ffffff;
      font-size: 16px;
    }
    .userName{
      opacity: 0.85;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
