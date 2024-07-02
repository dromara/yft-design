<template>
  <div>
    <el-row class="content-center">
      <el-col :span="6" class="center-col">
        <el-button text>换模板</el-button>
      </el-col>
      <el-col :span="6" class="center-col">
        <el-button text>换文字</el-button>
      </el-col>
      <el-col :span="6" class="center-col">
        <el-button text>换图片</el-button>
      </el-col>
      <el-col :span="6" class="center-col">
        <el-button text>添加</el-button>
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
.content-center {
  .center-col {
    display: flex;
    justify-content: center;
  }
}
</style>