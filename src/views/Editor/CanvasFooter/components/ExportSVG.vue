<template>
  <div class="export-json-dialog">
    <div class="preview">
      <pre style="margin: 0">{{ getSVGContent() }}</pre>
    </div>
    <div class="btns">
      <el-button class="btn export" type="primary" @click="exportSVG()">导出 SVG</el-button>
      <el-button class="btn close" @click="emit('close')">关闭</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useCanvasExport from '@/hooks/useCanvasExport'
import { useTemplatesStore } from '@/store'
import { storeToRefs } from 'pinia'
import useCanvas from '@/views/Canvas/useCanvas'
import useCenter from '@/views/Canvas/useCenter'
import { WorkSpaceClipType, WorkSpaceDrawType, WorkSpaceSafeColor, WorkSpaceClipColor, WorkSpaceSafeType } from '@/configs/canvas'
import { TransparentFill } from '@/configs/background'

const emit = defineEmits<{
  (event: 'close'): void
}>()
const { exportSVG } = useCanvasExport()
const { templates } = storeToRefs(useTemplatesStore())

const getSVGContent = () => {
  const [ canvas ] = useCanvas()
  const { originPoint } = useCenter()
  const { workSpaceDraw } = useCenter()
  const width = workSpaceDraw.width, height = workSpaceDraw.height
  canvas.getObjects().filter(obj => obj.type === WorkSpaceClipType).map(item => {item.stroke = TransparentFill})
  canvas.getObjects().filter(obj => obj.type === WorkSpaceSafeType).map(item => {item.stroke = TransparentFill})
  canvas.renderAll()
  // @ts-ignore
  const data = canvas.toSVG({
    viewBox: {
      x: originPoint.x,
      y: originPoint.y,
      width: width,
      height: height,
    },
    width: width + 'px',
    height: height + 'px'
  })
  canvas.getObjects().filter(obj => obj.type === WorkSpaceClipType).map(item => {item.stroke = WorkSpaceClipColor})
  canvas.getObjects().filter(obj => obj.type === WorkSpaceSafeType).map(item => {item.stroke = WorkSpaceSafeColor})
  canvas.renderAll()
  return data
}

</script>

<style lang="scss" scoped>
.export-json-dialog {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.preview {
  width: 100%;
  height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #f9f9f9;
  color: #0451a5;
}
.btns {
  width: 300px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  .export {
    flex: 1;
  }
  .close {
    width: 100px;
    margin-left: 10px;
  }
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #f9f9f9;
}
::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
}
</style>