<template>
  <el-dialog v-model="dialogVisible" width="35%" class="export-dialog" :before-close="closeExport">
    <div class="export-dialog">
      <div class="tabs">
        <div 
          class="tab" 
          :class="{ 'active': tab.key === exportType }"
          v-for="tab in tabs" 
          :key="tab.key"
          @click="setExportType(tab.key)"
        >{{tab.label}}</div>
      </div>
      <div class="content">
        <component :is="currentDialogComponent" @close="closeExport"></component>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { ExportTypes } from '@/types/common'

import ExportImage from './ExportImage.vue'
import ExportSVG from './ExportSVG.vue'
import ExportPDF from './ExportPDF.vue'
import ExportJSON from './ExportJSON.vue'

const mainStore = useMainStore()
const { exportType } = storeToRefs(mainStore)
const dialogVisible = ref(false)
const setExportType = mainStore.setExportType


const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

watch(() => props.visible, (val) => {
  dialogVisible.value = val
})

interface TabItem {
  key: ExportTypes
  label: string
}

const tabs: TabItem[] = [
  { key: 'image', label: '导出图片' },
  { key: 'svg', label: '导出SVG' },
  { key: 'pdf', label: '导出PDF' },
  { key: 'json', label: '导出JSON' },
]

const currentDialogComponent = computed(() => {
  const dialogMap = {
    'image': ExportImage,
    'svg': ExportSVG,
    'pdf': ExportPDF,
    'json': ExportJSON,
    '': '',
  }
  return dialogMap[exportType.value] || null
})

const closeExport = () => {
  emit('close')
}

</script>

<style lang="scss" scoped>

.tabs {
  height: 50px;
  font-size: 12px;
  flex-shrink: 0;
  display: flex;
  user-select: none;
  border-top-left-radius: $borderRadius;
  border-top-right-radius: $borderRadius;
  overflow: hidden;
}
.tab {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $lightGray;
  border-bottom: 1px solid $borderColor;
  cursor: pointer;

  &.active {
    background-color: #fff;
    border-bottom-color: #fff;
  }

  & + .tab {
    border-left: 1px solid $borderColor;
  }
}
.content {
  height: 400px;
  padding: 12px;
  font-size: 13px;

  @include overflow-overlay();
}
</style>

<style>
.export-dialog .el-dialog__body {
  padding: 0;
}

.export-dialog .el-dialog__header {
  padding: 0;
}

.export-dialog .el-dialog__headerbtn {
  display: none;
}
</style>