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
import { useTemplatesStore } from '@/store'
import { WorkSpaceThumbType, WorkSpaceDrawType } from '@/configs/canvas'
import { getObjectsBoundingBox } from '@/extension/util/common'
import { storeToRefs } from 'pinia'

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

const templatesStore = useTemplatesStore()
const { templateCanvas } = storeToRefs(templatesStore)
const viewportRatio = computed(() => props.template.height / props.template.width)
const height = computed(() => props.size * viewportRatio.value)
const thumbnailTemplate = ref()
// let thumbnailCanvas: StaticCanvas 
let thumbCanvas: StaticCanvas | undefined

onMounted(() => {
  thumbCanvas = new StaticCanvas(thumbnailTemplate.value, {
    width: props.size,
    height: props.size * viewportRatio.value,
    backgroundColor: props.template.workSpace.fillType === 0 ? props.template.workSpace.fill as string : '#fff'
  })
  templateCanvas.value.set(props.template.id, thumbCanvas as any)
  setThumbnailElement()
})

watch(props, () => {
  if (!thumbCanvas) return
  setThumbnailElement()
}, { deep: true })

const setThumbnailElement = async () => {
  if (!thumbCanvas) return
  await thumbCanvas.loadFromJSON(props.template)
  const thumbWorkSpaceDraw = thumbCanvas.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceDrawType)[0]
  thumbCanvas.getObjects().filter(item => WorkSpaceThumbType.includes(item.id)).map(item => (item as CanvasElement).visible = false)
  const width = props.template.width / props.template.zoom
  const thumbZoom = props.size / width
  thumbCanvas.setDimensions({
    width: props.size,
    height: props.size * viewportRatio.value
  })
  thumbCanvas.setZoom(thumbZoom)
  const thumbViewportTransform = thumbCanvas.viewportTransform
  const objects = thumbCanvas.getObjects().filter(ele => !WorkSpaceThumbType.includes(ele.id))
  // const boundingBox = Group.prototype.getObjectsBoundingBox(objects)
  const boundingBox = getObjectsBoundingBox(objects)
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
  thumbCanvas.setViewportTransform(thumbViewportTransform)
  thumbCanvas.renderAll()
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