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
import { StaticCanvas, Group } from 'fabric'
import { Template, CanvasElement } from '@/types/canvas'
import { WorkSpaceThumbType, WorkSpaceDrawType } from '@/configs/canvas'

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

watch(props, () => {
  if (!thumbCanvas.value) return
  setThumbnailElement()
}, { deep: true })

const setThumbnailElement = async () => {
  if (!thumbCanvas.value) return
  await thumbCanvas.value.loadFromJSON(props.template)
  const thumbWorkSpaceDraw = thumbCanvas.value.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceDrawType)[0]
  thumbCanvas.value.getObjects().filter(item => WorkSpaceThumbType.includes(item.id)).map(item => (item as CanvasElement).visible = false)
  const width = props.template.width / props.template.zoom
  const thumbZoom = props.size / width
  thumbCanvas.value.setDimensions({
    width: props.size,
    height: props.size * viewportRatio.value
  })
  thumbCanvas.value.setZoom(thumbZoom)
  const thumbViewportTransform = thumbCanvas.value.viewportTransform
  const objects = thumbCanvas.value.getObjects().filter(ele => !WorkSpaceThumbType.includes(ele.id))
  const boundingBox = Group.prototype.getObjectsBoundingBox(objects)
  let left = 0, top = 0
  if (thumbWorkSpaceDraw) {
    left = thumbWorkSpaceDraw.left
    top = thumbWorkSpaceDraw.top
  }
  else if (boundingBox) {
    left = boundingBox.centerX - boundingBox.width / 2
    top = boundingBox.centerY - boundingBox.height / 2
  }
  thumbViewportTransform[4] = -left * thumbZoom
  thumbViewportTransform[5] = -top * thumbZoom
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