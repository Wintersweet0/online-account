<!--  -->
<template>
  <div>
    <router-view />

    <van-tabbar route fixed>
      <van-tabbar-item replace to="/home" icon="balance-list-o">账单</van-tabbar-item>
      <van-tabbar-item replace to="/statistics" icon="chart-trending-o">统计</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'index',
  components: {},
  setup() {

    return {
    }
  }
}

</script>

<style lang='less' scoped>
</style>