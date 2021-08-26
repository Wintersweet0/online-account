<!-- 账单的详情页面 -->
<template>
  <div class="bill">
    <van-nav-bar
      title="账单详情"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="card">
      <div class="type">
        {{bill.category || '-'}}
      </div>
      <div class="num" v-if="bill.type == 1">
        -{{bill.num}}
      </div>
      <div class="num" v-else>
        +{{bill.num}}
      </div>
      <div class="time">
        <div>创建时间</div>
        <div>{{bill.time}}</div>
      </div>
      <div class="remark">
        <div>备注</div>
        <div>{{bill.remark || '-'}}</div>
      </div>
      <div class="operate van-hairline--top">
        <div class="delete van-hairline--right" @click="PopDelete">
          <van-icon name="delete-o" />删除
        </div>
        <div class="edit" @click="editBill">
          <van-icon name="edit" />编辑
        </div>
      </div>
    </div>
    <!-- 点击编辑可以弹出编辑组件 -->
    <PopAdd 
      ref="PopAddRef"
      :bill="bill"
      @refresh="getBill"
    ></PopAdd>
  </div>
</template>
<script>
import PopAdd from '@/components/PopAdd'

import { reactive, toRefs, ref } from '@vue/reactivity'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from '@vue/runtime-core'
import { get } from '@/utils/request'
import { Dialog, Toast } from 'vant'
export default {
  name: 'Bill',
  components: {
    PopAdd

  },
  setup(){
    const router = useRouter()
    const route = useRoute()
    const { id } = route.query
    const PopAddRef = ref(null)
    const state = reactive({
      bill: {},
    })
    const onClickLeft = () => {
      router.go(-1)
    }
    const PopDelete = () => {
      Dialog.confirm({
        title: '提示',
        message: '确认删除此记录？',
      })
        .then(async () => {
          let id = route.query.id
          let res = await get('https://qcz8mn.fn.thelarkcloud.com/deleteBillById', {id})
          Toast(res.data.msg)
          router.back()
        })
        .catch(() => {})
    }
    const editBill = () => {
      PopAddRef.value.toggle()
    }
    const getBill = async () => {
      let res = await get('https://qcz8mn.fn.thelarkcloud.com/getBillById', {id})
      console.log('res', res);
      state.bill = res.data
      state.bill.time = state.bill.time.slice(0,10)
    }
    onMounted(
      getBill()
    )

    return {
      ...toRefs(state),
      PopAddRef,
      onClickLeft,
      PopDelete,
      editBill,
      getBill,
    }
  }
}
</script>
<style lang="less" scoped>
.bill{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .card{
    background: #ffffff;
    margin: 12px 24px 0 24px;
    padding: 12px 24px 0 24px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 2px 0px rgba(0,0,0,0.3);
    .type{
      font-size: 15px;
      font-weight: 550;

    }
    .num{
      margin-top: 10px;
      font-size: 30px;
    }
    .time{
      width: 100%;
      margin-top: 10px;
      font-size: 15px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      div:nth-of-type(1){
        width: 30%;
        color: gray;
        text-align: left;
      }
      div:nth-of-type(2){
        
      }
    }
    .remark{
      width: 100%;
      margin: 10px 0 10px 0;
      font-size: 15px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      div:nth-of-type(1){
        width: 30%;
        color: gray;
        text-align: left;
      }
    }
    .operate{
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: 16px;
      div{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50%;
        height: 100%;
      }
      .delete{
        color: red;
      }
      .edit{
        color: rgb(28, 85, 240);
      }
    }
  }
}
</style>