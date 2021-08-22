<!--  -->
<template>
  <van-popup v-model:show="show" position="bottom" round closeable close-icon-position="top-left">
    <div class="wrap">
      <header class="header">
        <van-button class="add-btn" type="primary" size="small" @click="addBill">确定</van-button>
      </header>
      <div class="filter">
        <div class="type">
          <span @click="changeType(1)" :class="{ expense: true, active: payType == 1}">
            支出
          </span>
          <span @click="changeType(0)" :class="{ income: true, active: payType == 0}">
            收入
          </span>
        </div>
        <div @click="showDay = true" class="time">
          {{fmtDate(date)}}
          <van-icon name="arrow-down" />
        </div>
      </div>
      <van-cell-group>
        <van-field
          class="amount"
          v-model="amount"
          type="number"
          label="金额￥"
          placeholder="请输入金额"
          :formatter="formatAmount"
        />
      </van-cell-group>
      <van-dropdown-menu v-if="payType == 1">
        <van-dropdown-item v-model="category1" :options="option1" />
      </van-dropdown-menu>
      <van-dropdown-menu v-else>
        <van-dropdown-item v-model="category2" :options="option2" />
      </van-dropdown-menu>
      <van-cell-group>
        <van-field v-model="remark" label="备注" placeholder="请输入备注" />
      </van-cell-group>
    </div>
    <van-popup v-model:show="showDay" position="bottom" round :style="{height: '45%'}">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        @confirm="chooseDay"
        @cancel="showDay = false"
      />
    </van-popup>
  </van-popup>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
import { formatDate } from '@/utils/formatDate'
import { post } from '@/utils/request'
import { Toast } from 'vant'
export default {
  name: 'PopAdd',
  props: {
    refresh: Function,
    bill: {
      type: Object,
      default: {}
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      show: false,
      payType: props.bill._id ? props.bill.type : 1,
      showDay: false,
      date: props.bill._id ? new Date(props.bill.time) : new Date(),
      currentDate: props.bill._id ? new Date(props.bill.time) :  new Date(),
      amount: props.bill._id ? String(props.bill.num.toFixed(2)) : '',
      category1: props.bill._id ? props.bill.category : '衣服',
      category2: props.bill._id ? props.bill.category : '工资',
      option1: [
        {text: '衣服', value: '衣服'},
        {text: '食物', value: '食物'},
        {text: '住宿', value: '住宿'},
        {text: '交通', value: '交通'},
        {text: '其他', value: '其他'},
      ],
      option2: [
        {text: '工资', value: '工资'},
        {text: '补贴', value: '补贴'},
        {text: '其他', value: '其他'},
      ],
      remark: props.bill._id ? props.bill.remark : '',
    })

    const toggle = () => {
      if(props.bill._id){
        state.payType = props.bill.type
        state.date = new Date(props.bill.time)
        state.currentDate = new Date(props.bill.time)
        state.amount = String(Number(props.bill.num).toFixed(2))
        if(props.bill.type == 1){
          state.category1 = props.bill.category
        }else{
          state.category2 = props.bill.category
        }
        state.remark = props.bill.remark
      }
      state.show = !state.show;
    }
    const changeType = (type) => {
      state.payType = type
      // console.log('state.payType', state.payType);
    }
    const chooseDay = (value) => {
      state.date = value
      state.showDay = false
    }
    const fmtDate = (time) => {
      let res = formatDate(time)
      // console.log('formatDate', res);
      return res
    }
    const formatAmount = (value) => {
      if(value == '-') return ''
      if(value == '.' && state.amount.length == 0){
        return ''
      }
      if(value == '.') return '.'
      if(value != '.' && state.amount.includes('.') && state.amount.split('.')[1].length >= 2){
        state.amount = Number(state.amount).toFixed(2)
      }
      return value
    }
    const addBill = async() => {
      if (!state.amount) {
        Toast.fail('请输入具体金额')
        return
      }
      let date2 = state.date
      let fmtDate2 = `${date2.getFullYear()}-${date2.getMonth()+1}-${date2.getDate()}`
      const params = {
        type: state.payType,
        num: Number(state.amount),
        remark: state.remark,
        time: fmtDate2,
      }
      if(state.type == 1){
        params.category = state.category1
      }else{
        params.category = state.category2
      }
      if(props.bill._id){
        //如果有id需要调用更新接口
        console.log('走的是修改接口');
        params.id = props.bill._id
        console.log('你可爱的params', params);
        const res = await post("https://qcz8mn.fn.thelarkcloud.com/updateBill", params)
        state.show = false
        Toast.success('修改成功')
        emit('refresh')
      }else{
        console.log('走的是添加接口');
        const data = await post("https://qcz8mn.fn.thelarkcloud.com/insertBill", params)
        state.amount = ''
        state.payType = 1
        state.remark = ''
        state.date = new Date()
        state.currentDate = new Date()
        state.category1 = '衣服'
        state.category2 = '工资'
        state.show = false
        Toast.success('添加成功')
        emit('refresh')
      }
    }
    return {
      ...toRefs(state),
      toggle,
      changeType,
      chooseDay,
      fmtDate,
      formatAmount,
      addBill,
    }
  }
}

</script>

<style lang='less' scoped>
@blue1: rgb(28, 85, 240);
.wrap{
  height: 400px;
  width: 100%;
  background: white;
}
.header{
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  .add-btn {
    width: 50px;
    height: 35px;
    margin: 10px 15px 0 0;
  }
}
.type{
  float: left;
  span{
    display: inline-block;
    background: aliceblue;
    width: 50px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border: 1px solid #f5f5f5;
  }
  .expense{
    margin: 10px 10px 0 15px;
  }
  .income{
    margin: 10px 10px 0 0;
  }
  .active{
    border-color: @blue1;
    background-color: @blue1;
    color: #f5f5f5;
  }
  
}
.time{
  display: inline-block;
  width: 80px;
  height: 30px;
  background: rgba(218, 216, 216, 0.671);
  font-size: 14px;
  text-align: center;
  line-height: 30px;
  margin: 10px 0 0 -10px;
  border-radius: 5px;
}
</style>