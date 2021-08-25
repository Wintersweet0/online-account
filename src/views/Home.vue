<template>
  <div class="wrap">
    <div class="header">
      <div class="type-wrap">
        <div class="date" @click="PopMonthRefToggle">
          {{formatMonth(currentTime)}}
          <van-icon name="arrow-down" />
        </div>
        <div class="type" @click="PopCategoryRefToggle">
          {{currentCategory}}
          <van-icon name="apps-o" />
        </div>
        <div class="title">
          我的账单
        </div>
      </div>
      <div class="data-wrap">
        <span>总支出￥{{totalExpense.toFixed(2)}}</span>
        <span>总收入￥{{totalIncome.toFixed(2)}}</span>
      </div>
    </div>
    <div class="content-wrapper">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="到底啦~"
          @load="onLoad"
        >
          <CardItem v-for="(item, index) in list" :key="index" :bill="item"></CardItem>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="add" @click="addBill">
      <van-icon name="records" />
    </div>
    <PopAdd ref="PopAddRef" @refresh="getBillList"></PopAdd>
    <PopCategory ref="PopCategoryRef" @selectCategory="selectCategory"></PopCategory>
    <PopMonth ref="PopMonthRef" :currentTime="currentTime" @selectMonth="selectMonth"></PopMonth>
  </div>
</template>

<script>
// @ is an alias to /src
import {post, get} from '@/utils/request'
import {ref, onMounted, reactive, toRefs} from 'vue'
import CardItem from '@/components/CardItem'
import PopAdd from '@/components/PopAdd'
import PopCategory from '@/components/PopCategory'
import PopMonth from '@/components/PopMonth'
import { formatMonth } from '@/utils/formatDate'

export default {
  name: 'Home',
  components: {
    PopAdd,
    CardItem,
    PopCategory,
    PopMonth,

  },
  setup(){
    const state = reactive({
      isLoading: false,
      loading: false,
      finished: false,
      list: [],
      totalExpense: 0,
      totalIncome: 0,
      currentTime: new Date(),
      currentCategory: "全部显示",
    })
    
    
    const CardItem = ref(null)
    const PopAddRef = ref(null)
    const PopCategoryRef = ref(null)
    const PopMonthRef = ref(null)
    const PopCategoryRefToggle = () => {
      PopCategoryRef.value.toggle()
    }
    const PopMonthRefToggle = () => {
      PopMonthRef.value.toggle()
    }

    const addBill = () => {
      console.log('PopAddRef',PopAddRef.value.show)
      PopAddRef.value.toggle()
    }
    const getBillList = async () => {
      let params = {
        date: formatMonth(state.currentTime),
        category: state.currentCategory,
      }
      const { data } = await get('https://qcz8mn.fn.thelarkcloud.com/queryByMonthCategory', params)
      
      data.sort((a, b) => {
        return Number(a.time.slice(-2)) > Number(b.time.slice(-2)) ? -1 : 1
      })
      console.log('data', data);
      state.list = data
      calcTotal()
      state.loading = false
    }
    const calcTotal = () => {
      state.totalExpense = state.list.reduce((total, cur) => {
        return total + cur.bills.filter((item) => {
          return item.type == '1'
        }).reduce((pre, c) => {
          return pre + Number(c.num)
        }, 0)
      }, 0)
      state.totalIncome = state.list.reduce((total, cur) => {
        return total + cur.bills.filter((item) => {
          return item.type == '0'
        }).reduce((pre, c) => {
          return pre + Number(c.num)
        }, 0)
      }, 0)
    }
    const onLoad = () => {
      console.log('onLoad');
      getBillList()
      state.finished = true
      state.loading = false
    }
    const onRefresh = () => {
      getBillList()
      state.isLoading = false
    }
    const selectCategory = (item) => {
      state.currentCategory = item
      getBillList()
    }
    const selectMonth = (item) => {
      state.currentTime = item
      getBillList()
    }

    onMounted(async () => {
      onLoad()
    })
    return {
      ...toRefs(state),
      CardItem,
      PopAddRef,
      PopCategoryRefToggle,
      PopCategoryRef,
      PopMonthRef,
      PopMonthRefToggle,
      addBill,
      getBillList,
      onLoad,
      onRefresh,
      selectCategory,
      selectMonth,
      calcTotal,
      formatMonth,
    }
  }
}
</script>

<style lang="less" scoped>
@blue1: rgb(28, 85, 240);
.wrap{

  width: 100%;
  height: 100%;
  .content-wrapper{
    width: 100%;
    height: 100%;
    padding: 10px 0 0 0;
    overflow-y: auto;
  }
  .header{
    height: 85px;
    width: 100%;
    color: #f5f5f5;
    background-color: @blue1;
    .type-wrap{
      width: 100%;
      display: flex;
      flex-direction: row-reverse;
      line-height: 30px;
      font-size: 13px;
      .type{
        margin: 20px 10px 0 0;
        height: 30px;
        width: 80px;
        border: 1px solid white;
        border-radius: 5px;
      }
      .date{
        margin: 20px 20px 0 0;
        height: 30px;
        width: 70px;
        border: 1px solid white;
        border-radius: 5px;
      }
      .title{
        flex-grow: 1;
        text-align: left;
        font-size: 18px;
        margin: 20px 0 0 20px;
      }
    }
    .data-wrap{
      font-size: 15px;
      text-align: left;
      margin: 10px 0 0 20px;
      span{
        margin: 0 10px 0 0;
      }
    }
    
  }
  .add{
    display: flex;
    position: fixed;
    height: 50px;
    width: 50px;
    bottom: 100px;
    right: 30px;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    background-color: #fff;
    box-shadow: 0 0 10px 0px rgba(0,0,0,0.3);
    color: @blue1;
  }
}
</style>
