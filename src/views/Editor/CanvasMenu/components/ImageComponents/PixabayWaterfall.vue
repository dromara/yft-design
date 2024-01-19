<script lang="ts" setup>
// import { propTypes } from '@/utils/propTypes'
// import { useDesign } from '@/hooks/web/useDesign'
import { ImageHit } from '@/api/image/types'
import { ref, nextTick, unref, onMounted, watch } from 'vue'
import { useEventListener, useIntersectionObserver } from '@vueuse/core'
import { debounce } from 'lodash-es'

// const { getPrefixCls } = useDesign()

// const prefixCls = getPrefixCls('waterfall')

const emit = defineEmits(['loadMore'])

const props = defineProps({
  data: {
    type: Array<ImageHit>,
    default: []
  },
  reset: {
    type: Boolean,
    default: true
  },
  width: {
    type: Number,
    default: 200,
  },
  gap: {
    type: Number,
    default: 20,
  },
  // props: propTypes.objectOf(propTypes.string).def({
  //   src: 'src',
  //   height: 'height'
  // }),
  cols: {
    type: Number,
    default: 2
  },
  loadingText: {
    type: String,
    default: '加载中'
  },
  loading: {
    type: Boolean,
    default: false
  },
  end: {
    type: Boolean,
    default: false
  },
  endText: {
    type: String,
    default: '没有更多了'
  },
  autoCenter: {
    type: Boolean,
    default: true
  },
  // layout: propTypes.oneOf(['javascript', 'flex']).def('flex')
})

const wrapEl = ref<HTMLDivElement>()

const heights = ref<number[]>([])

const wrapHeight = ref(0)

const wrapWidth = ref(0)

const loadMore = ref<HTMLDivElement>()

// 首先确定列数 = 页面宽度 / 图片宽度
const innerCols = ref(0)

const filterData = ref<any[]>([])

const flexWaterfall = async () => {
  const { width, gap } = props
  const data = props.data as any[]
  await nextTick()

  const container = unref(wrapEl) as HTMLElement
  if (!container || !data ) return
  innerCols.value = props.cols ?? Math.floor(container.clientWidth / (width + gap))

  const length = data.length
  // 根据列数，创建数组
  const arr = new Array(unref(innerCols)).fill([])
  // 循环data，依次插入到arr中
  for (let i = 0; i < length; i++) {
    const index = i % unref(innerCols)
    arr[index] = [...arr[index], data[i]]
  }
  filterData.value = arr
  console.log('filterData.value:', filterData.value)
}

watch([props.data], () => {
  flexWaterfall()
}, {immediate: true})

onMounted(() => {
  if (unref(props.reset)) {
    useEventListener(window, 'resize', debounce(flexWaterfall, 300))
  }
  useIntersectionObserver(
    unref(loadMore),
    ([{ isIntersecting }]) => {
      if (isIntersecting && !props.loading && !props.end) {
        emit('loadMore')
      }
    },
    {
      threshold: 0.1
    }
  )
})
</script>

<template>
  <div ref="wrapEl">
    <template>
      <div class="relative flex pb-40px">
        <div
          v-for="(item, $index) in filterData"
          :key="`waterWrap-${$index}`"
          class="flex-1"
          :style="{
            marginRight: $index === filterData.length - 1 ? '0' : `${gap}px`
          }"
        >
          <div
            v-for="(child, i) in item"
            :key="`waterWrap-${$index}-${i}`"
            :style="{
              marginBottom: `${gap}px`,
              width: cols ? '100%' : `${width}px`,
              height: cols ? 'auto' : `${child[child.height as string]}px`
            }"
          >
            <img :src="child[child.previewURL as string]" class="w-full h-full block" alt="" srcset="" />
          </div>
        </div>
        <div
          ref="loadMore"
          class="h-40px flex justify-center absolute w-full items-center"
          :style="{
            bottom: 0
          }"
        >
          {{ end ? endText : loadingText }}
        </div>
      </div>
    </template>
  </div>
</template>