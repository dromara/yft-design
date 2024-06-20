<template>
  <div class="export-svg-dialog">
    <div class="preview" v-html="svgHtml"></div>
    <div class="btns">
      <el-button class="btn export" type="primary" @click="exportSVG()">导出 SVG</el-button>
      <el-button class="btn close" @click="emit('close')">关闭</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import useCanvasExport from '@/hooks/useCanvasExport'

const emit = defineEmits<{(event: 'close'): void}>()

const { exportSVG, getSVGData } = useCanvasExport()

const svgHtml = computed(() => getSVGData())

</script>

<style lang="scss" scoped>
.export-svg-dialog {
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
  // svg {
  //   width: 100%;
  //   height: 100%;
  // }
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
<style>
.preview svg {
  width: 100%;
  height: 100%;
}
</style>