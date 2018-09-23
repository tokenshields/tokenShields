<template>
  <div class="sidebox" ref="sidebox">
    <el-container>
      <el-aside width="205px">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo">
          <el-menu-item index="1" disabled>
            <i class="el-icon-menu"></i>
            <span slot="title">My account</span>
          </el-menu-item>
          <el-menu-item index="2" @click="goAccount">
            <i class="el-icon-document"></i>
            <span slot="title">Account information</span>
          </el-menu-item>
          <el-menu-item index="3" @click="goTransfer">
            <i class="el-icon-setting"></i>
            <span slot="title">Transfer</span>
          </el-menu-item>
          <el-menu-item index="4" @click="goSetting">
            <i class="el-icon-setting"></i>
            <span slot="title">Setting</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>



export default {
  name: 'sidebox',
  data () {
    return {

    }
  },
  mounted () {
    this.setMinHeight()
  },
  methods: {
    setMinHeight () {
      this.$refs.sidebox.style.minHeight = document.documentElement.clientHeight - 105 + 'px' || document.body.clientHeight - 105 + 'px'
    },
    goAccount () {
      this.$router.push('/tokenIndex/sidebox/account')
    },
    goTransfer () {
      this.$router.push('/tokenIndex/sidebox/transfer')
    },
    goSetting () {
      this.$router.push('/tokenIndex/sidebox/limitWhite')
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.sidebox{
  width: 900px;
  background: #FFFFFF;
  border-radius: 2px;
  margin: 0 auto;
  .el-menu-vertical-demo{
    width: 205px;
  }
}
</style>
