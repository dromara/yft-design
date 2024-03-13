<template>
  <div>
    <el-affix position="bottom" :offset="45" v-show="unitMode === 0" style="width: calc(100%)">
      <el-checkbox-group v-model="showWorkLines" @change="changeWorkLines">
        <el-tooltip placement="top" :hide-after="0" :content="(showClip ?t('message.hideBloodsLine') : t('message.showBloodsLine'))">
          <el-checkbox-button type="primary" class="clip-btn" value="clip" :checked="showClip">
            <IconCuttingOne/>
          </el-checkbox-button>
        </el-tooltip>
        <el-tooltip placement="top" :hide-after="0" :content="t('message.draggingCanvas')">
          <el-checkbox-button type="primary" value="drag" :checked="isDrag">
            <IconClickTap/>
          </el-checkbox-button>
        </el-tooltip>
        <el-tooltip placement="top" :hide-after="0" :content="(showSafe ? t('message.showSafeLine') : t('message.hideSafeLine'))">
          <el-checkbox-button type="primary" class="safe-btn" value="safe" :checked="showSafe">
            <IconShield/>
          </el-checkbox-button>
        </el-tooltip>
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
import useI18n from '@/hooks/useI18n'


const fabricStore = useFabricStore()
const mainStore = useMainStore()
const keyboardStore = useKeyboardStore()
const { showClip, showSafe } = storeToRefs(fabricStore)
const { unitMode } = storeToRefs(mainStore)
const { t } = useI18n()
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