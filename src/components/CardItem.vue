<!-- 账目组件，每个组件显示一天时间内的账目 -->
<template>
  <van-cell-group class="group" inset>
    <div class="header">
      <div class="date">{{bill.time}}</div>
      <div class="money">
        <span>支出: -{{ expense.toFixed(2) }}</span>
        <span>收入: +{{ income.toFixed(2) }}</span>
      </div>
    </div>
    <van-cell v-for="(item, index) in bill.bills"
      :key="index"
      :title="item.category"
      :icon="icons[item.category]"
      :value="`${item.type == 1 ? '-' : '+'}${Number(item.num).toFixed(2)}`"
      :label="item.remark"
      @click="goToBill(item)"
    />

  </van-cell-group>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
import { onMounted, onUpdated } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default {
  name: 'CardItem',
  props: {
    bill: {
      type: Object,
      default: {}
    }
  },
  components: {},
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      expense: 0,
      income: 0,
      icons: {
        "衣服": "bag-o",
        "食物": "shop-collect-o",
        "住宿": "home-o",
        "交通": "logistics",
        "其他": "pending-payment",
        "工资": "cash-on-deliver",
        "补贴": "balance-pay",
      }
    })

    const calcItem = () => {
      state.expense = props.bill.bills
        .filter((item) => {
          return item.type == '1'
        })
        .reduce((item, cur) => {
          return item + cur.num
        },0)

      state.income = props.bill.bills
        .filter((item) => {
          return item.type == '0'
        })
        .reduce((item, cur) => {
          return item + cur.num
        },0)
    }
    const goToBill = (item) => {
      console.log('item', item);
      console.log('router', router);
      console.log('route', route)
      router.push({
        path: '/bill',
        query: {
          id: item.id
        }
      })
    }
    onMounted(() => {
      calcItem()
    })
    onUpdated(() => {
      calcItem()
    })

    return {
      ...toRefs(state),
      goToBill
    }
  }
}

</script>

<style lang='less' scoped>

.group{
  box-shadow: 0 0 2px 0px rgba(0,0,0,0.3);
}
.header{
  background: rgb(28, 85, 240);
  display: flex;
  justify-content: space-between;
  padding: 10px 10px 10px 10px;
  font-size: 14px;
  color: #f5f5f5;
  
  .money{
    span{
      margin-left: 25px;
    }
  }
}
</style>
<style>
:root{
  --van-cell-border-color: gray;
  --van-cell-horizontal-padding: 35px;
  --van-cell-font-size: 18px;
  --van-cell-icon-size: 24px;
  --van-cell-label-margin-top: 15px;
  --van-cell-label-font-size: 14px;
}
</style>