<template>
  <div>
    <el-affix position="bottom" :offset="45" v-show="unitMode === 0" style="width: calc(100%)">
      <el-checkbox-group v-model="showWorkLines" @change="changeWorkLines">
        <el-checkbox-button type="primary" class="clip-btn" label="clip" :checked="showClip">
          <el-tooltip placement="top" :hide-after="0" :content="(showClip ? '隐藏' : '显示') + '出血线'">
            <IconCuttingOne/>
          </el-tooltip>
        </el-checkbox-button>
        <el-checkbox-button type="primary" label="drag" :checked="isDrag">
          <el-tooltip placement="top" :hide-after="0" content="拖拽画布">
            <IconClickTap/>
          </el-tooltip>
        </el-checkbox-button>
        <el-checkbox-button type="primary" class="safe-btn" label="safe" :checked="showSafe">
          <el-tooltip placement="top" :hide-after="0" :content="(showSafe ? '隐藏' : '显示') + '安全线'">
            <IconShield/>
          </el-tooltip>
        </el-checkbox-button>
      </el-checkbox-group>
    </el-affix>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { CanvasElement } from '@/types/canvas'
import { WorkSpaceClipType, WorkSpaceSafeType } from '@/configs/canvas'
import { useFabricStore, useKeyboardStore, useMainStore } from '@/store'
import useCanvas from '@/views/Canvas/useCanvas'


const fabricStore = useFabricStore()
const mainStore = useMainStore()
const keyboardStore = useKeyboardStore()
const { showClip, showSafe } = storeToRefs(fabricStore)
const { unitMode } = storeToRefs(mainStore)
const showWorkLines = ref<string[]>([])
const isDrag = ref(false)

const changeWorkLines = () => {
  showClip.value = showWorkLines.value.filter(item => item === 'clip').length > 0
  showSafe.value = showWorkLines.value.filter(item => item === 'safe').length > 0
  isDrag.value = showWorkLines.value.filter(item => item === 'drag').length > 0
  keyboardStore.setSpaceKeyState(isDrag.value)
  const [ canvas ] = useCanvas()
  const WorkSpaceClip = canvas.getObjects().filter(ele => (ele as CanvasElement).id === WorkSpaceClipType)
  const WorkSpaceSafe = canvas.getObjects().filter(ele => (ele as CanvasElement).id === WorkSpaceSafeType)
  if (!WorkSpaceClip && !WorkSpaceSafe) return
  WorkSpaceClip.map(item => item.set({visible: showClip.value}))
  WorkSpaceSafe.map(item => item.set({visible: showSafe.value}))
  canvas.renderAll()
}

</script>

<style>
.center-affix .el-affix .el-affix--fixed {
  display: flex;
  justify-content: center;
}
.el-affix .el-checkbox-group .clip-btn .el-checkbox-button__inner {
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
.el-affix .el-checkbox-group .safe-btn .el-checkbox-button__inner {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}
</style>