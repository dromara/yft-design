<template>
  <div 
    ref="wrapperRef" 
    @mousedown="addDrawAreaFocus"
    v-contextmenu="contextMenus" 
    v-click-outside="remDrawAreaFocus"
  >
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted } from 'vue'
import { useFabricStore, useMainStore } from '@/store'

import { contextMenus } from '@/configs/contextMenu'
import { initEditor } from '@/views/Canvas/useCanvas'
import { initFilter } from '@/views/Canvas/useFilter'
import useCanvasHotkey from '@/hooks/useCanvasHotkey'
const fabricStore = useFabricStore()
const mainStore = useMainStore()
const { wrapperRef, canvasRef } = storeToRefs(fabricStore)
const { drawAreaFocus } = storeToRefs(mainStore)
const { keydownListener, keyupListener } = useCanvasHotkey()

onMounted(() => {
  initEditor()
  initFilter()
  document.addEventListener('keydown', keydownListener)
  document.addEventListener('keyup', keyupListener)
  window.addEventListener('blur', keyupListener)
})

onUnmounted(() => {
  document.removeEventListener('keydown', keydownListener)
  document.removeEventListener('keyup', keyupListener)
  window.removeEventListener('blur', keyupListener)
})

// 点击画布区域
const addDrawAreaFocus = () => {
  if (!drawAreaFocus.value) mainStore.setDrawAreaFocus(true)
}

const remDrawAreaFocus = () => {
  if (drawAreaFocus.value) mainStore.setDrawAreaFocus(false)
}
</script>

<style lang="scss" scoped>
.full-size {
  height: 100%;
  width: 100%;
}
.background-grid {
  --offsetX: 0px;
  --offsetY: 0px;
  --size: 16px;
  --color: #dedcdc;
  background-image: linear-gradient(
      45deg,
      var(--color) 25%,
      transparent 0,
      transparent 75%,
      var(--color) 0
    ),
    linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
  background-position: var(--offsetX) var(--offsetY),
    calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
  background-size: calc(var(--size) * 2) calc(var(--size) * 2);
}
</style>
