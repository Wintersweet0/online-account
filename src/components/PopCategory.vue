<!-- PopCategory选择记账类型进行分类 -->
<template>
  <van-popup v-model:show="show" position="bottom" round>
    <van-picker
      title="分类显示"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </van-popup>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
export default {
  name: 'PopCategory',
  props: {
    selectCategory: {
      type: Function,
    }
  },
  components: {},
  setup(props, { emit }) {
    const state = reactive({
      show: false,
      columns: [
        '全部显示',
        '衣服',
        '食物',
        '住宿',
        '交通'
      ]
    })

    const toggle = () => {
      state.show = !state.show
    }
    const onConfirm = (value, index) => {
      emit('selectCategory', value)
      state.show = false
    }
    const onCancel = () => {
      state.show = false
    }

    return {
      ...toRefs(state),
      toggle,
      onConfirm,
      onCancel,

    }
  }
}

</script>

<style lang='less' scoped>
</style>