<template>
  <div>
    <el-row>
      <el-col :span="6">
        换模板
      </el-col>
      <el-col :span="6">
        换文字
      </el-col>
      <el-col :span="6">
        换图片
      </el-col>
      <el-col :span="6">
        添加
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import useCanvas from "@/views/Canvas/useCanvas"
import useHandleElement  from '@/hooks/useHandleElement'
import useI18n from '@/hooks/useI18n'
import { storeToRefs } from 'pinia'
import { useFabricStore, useTemplatesStore } from '@/store'

const fabricStore = useFabricStore()
const { isChecked } = storeToRefs(fabricStore)
const { t } = useI18n()
const exportFileDialog = ref(false)


const exportFileHide = () => {
  exportFileDialog.value = false
}

const exportFileHandle = () => {
  exportFileDialog.value = false
}

const exportFile = () => {
  exportFileDialog.value = true
}

const loadFile = (files: FileList) => {
  const jsonFile = files[0]
  if (!jsonFile) return
  const reader = new FileReader()
  const [ canvas ] = useCanvas()
  reader.onload = event => {
    const jsonContent = event.target?.result?.toString()
    if (!jsonContent) return
    const jsonData = JSON.parse(jsonContent)
    canvas.setViewportTransform(jsonData.viewportTransform)
    canvas.setZoom(jsonData.zoom)
  }
  reader.readAsText(jsonFile)
}

</script>

<style lang="scss" scoped>
.footer-left {
  display: flex;
  width: 80px;
  cursor: pointer;
  align-items: center;
}
.left-handle {
  height: 24px;
  flex: 1;
  position: relative;
  border-radius: $borderRadius;
  &:hover{
    background-color: #f1f1f1;
  }
  a {
    color: inherit;
  }
}

.footer-right {
  display: flex;
  cursor: pointer;
}

.footer-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.right-handle {
  width: 40px;
  flex: 1;
  position: relative;
}
// .resize-handler {
//   height: 7px;
//   position: absolute;
//   top: -3px;
//   left: 0;
//   right: 0;
//   cursor: n-resize;
//   z-index: 2;
// }
</style>