<template>
  <div class="thumbnail-slide"
    :style="{
      width: props.size + 'px',
      height: height + 'px',
    }"
  >
    <div v-if="visible">
      <canvas ref="thumbnailTemplate"></canvas>
    </div>
    <div class="placeholder" v-else>加载中 ...</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, PropType, ref, watch } from 'vue'
import { StaticCanvas, Gradient, Pattern, Rect, Image } from 'fabric'
import { Template, CanvasElement } from '@/types/canvas'
import { TransparentFill } from '@/configs/background'
import { 
  WorkSpaceName, 
  WorkSpaceDrawType,
} from '@/configs/canvas'

const RectFillType = 'RectFillType'

const props = defineProps({
  template: {
    type: Object as PropType<Template>,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
})

// const viewportRatio = ref<number>(props.template.height / props.template.width) 
const viewportRatio = computed(() => props.template.height / props.template.width)
const height = computed(() => props.size * viewportRatio.value)
const thumbnailTemplate = ref()
// let thumbnailCanvas: StaticCanvas 
const thumbCanvas = ref<StaticCanvas | undefined>(undefined)

onMounted(() => {
  thumbCanvas.value = new StaticCanvas(thumbnailTemplate.value, {
    width: props.size,
    height: props.size * viewportRatio.value,
    backgroundColor: props.template.workSpace.fillType === 0 ? props.template.workSpace.fill as string : '#fff'
  })
  setThumbnailElement()
})

watch(props ,() => {
  if (!thumbCanvas.value) return
  setThumbnailElement()
}, { deep: true })

const setThumbnailElement = async () => {
  if (!thumbCanvas.value) return
  await thumbCanvas.value.loadFromJSON(props.template)
  const thumbWorkSpaceDraw = thumbCanvas.value.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceDrawType)[0]
  thumbCanvas.value.getObjects().filter(item => (item as CanvasElement).name === WorkSpaceName && (item as CanvasElement).id !== WorkSpaceDrawType).map(item => (item as CanvasElement).visible = false)
  const width = props.template.width / props.template.zoom
  const thumbZoom = props.size / width
  thumbCanvas.value.width = props.size
  thumbCanvas.value.height = props.size * viewportRatio.value
  thumbCanvas.value.setZoom(thumbZoom)
  const thumbViewportTransform = thumbCanvas.value.viewportTransform
  thumbViewportTransform[4] = -thumbWorkSpaceDraw.left * thumbZoom
  thumbViewportTransform[5] = -thumbWorkSpaceDraw.top * thumbZoom
  thumbCanvas.value.setViewportTransform(thumbViewportTransform)
  thumbCanvas.value.renderAll()
}
</script>

<style lang="scss" scoped>
.thumbnail-slide {
  background-color: #fff;
  overflow: hidden;
  user-select: none;
}
.elements {
  transform-origin: 0 0;
}
.background {
  width: 100%;
  height: 100%;
  background-position: center;
  position: absolute;
}
.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>