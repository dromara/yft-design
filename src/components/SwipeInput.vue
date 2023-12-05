<template>
  <el-input-number
    class="swipe-input"
    v-model="numberValue" 
    :step="step" 
    :max="max" 
    :min="min"
    :controls="false"
    :label="label"
    @change="change"
  >
  </el-input-number>
</template>
<script setup lang="ts">
import { usePointerSwipe, useVModel, isDefined, useMagicKeys } from '@vueuse/core'
import { useSlots, watch, ref, computed } from 'vue'
import { toFixed } from '@/utils/common'
import { useMainStore } from '@/store';
import { storeToRefs } from 'pinia';
import { mm2px, px2mm } from '@/utils/image';


const props = withDefaults(
  defineProps<{
    label?: string
    modelValue?: number
    modelEvent?: 'change' | 'input'
    step?: number
    max?: number
    min?: number
  }>(),
  {
    modelEvent: 'change',
    step: 1,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | undefined): void
  (e: 'change', value: number | undefined, ev: Event): void
  (e: 'swipe', value: number | undefined, ev: Event): void
}>()

const slots = useSlots()

const numberValue = useVModel(props, 'modelValue', emit)

watch(numberValue, (value) => {
  if (!value) return
  numberValue.value = toFixed(value)
}, { immediate: true})

const change = (value: number | undefined, ev: Event) => {
  emit('change', value, ev)
}

// Swipe
// const { shift, alt } = useMagicKeys()
// const labelRef = ref<HTMLElement>()
// const startValue = ref<number>()
// const { posStart, posEnd } = usePointerSwipe(labelRef, {
//   threshold: 0,
//   onSwipeStart: () => {
//     startValue.value = numberValue.value
//   },
//   onSwipe: (e) => {
//     // 检查startValue的值是否是数字，如果不是，退出函数
//     if (!isNumber(startValue.value)) return
//     // 根据props.step的值调整步长
//     let step = props.step
//     if (shift.value) step *= 10
//     if (alt.value) step /= 10
//     step = Math.max(step, 0.01)
//     // 根据鼠标拖动的距离计算新的数值
//     let value = startValue.value + Math.round(posEnd.x - posStart.x) * step
//     // 如果props.min或props.max存在，则确保新值在指定范围内
//     if (isDefined(props.min) && value < props.min) value = props.min
//     if (isDefined(props.max) && value > props.max) value = props.max
//     // 四舍五入计算的值，并将其分配给numberValue
//     value = toFixed(value)
//     numberValue.value = value
//     // 调用swipe函数并传递新值和事件对象
//     emit('swipe', value, e)
//   },
//   onSwipeEnd: (e) => {
//     emit('change', numberValue.value, e)
//     startValue.value = undefined
//   },
// })

// const hasLabel = computed(() => !!props.label || !!slots.label)
</script>



<style scoped lang="scss">
.swipe-input {
  :deep(.el-input__wrapper) {
    padding: 1px;
  }
  :deep(.el-input__prefix-inner) {
    margin: 0;
    width: 25px;
  }
  :deep(.label-ref) {
    margin: 0;
  }
}
</style>
