<!-- PopMonth按月份筛选账单 -->
<template>
  <van-popup v-model:show="show" position="bottom" round>
    <van-datetime-picker
      v-model="currentMonth"
      type="year-month"
      title="选择年月"
      @confirm="onConfirm"
      @cancel="showDay = false"
    />
  </van-popup>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
export default {
  name: 'PopMonth',
  props: {
    currentTime: {
      type: Date,
      default: new Date()
    },
    selectMonth: {
      type: Function,
    },
  },
  components: {},
  setup(props, { emit }) {
    const state = reactive({
      show: false,
      currentMonth: props.currentTime
    })
    const onConfirm = (value) => {
      emit('selectMonth', value)
      state.show = false
    }
    const toggle = () => {
      state.show = !state.show
    }
    return {
      ...toRefs(state),
      onConfirm,
      toggle,
    }
  }
}

</script>

<style lang='less' scoped>
</style>