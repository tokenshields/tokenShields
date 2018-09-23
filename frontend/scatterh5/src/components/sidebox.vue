<template>
  <div class="sidebox" ref="sidebox">
    
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
}
</style>
