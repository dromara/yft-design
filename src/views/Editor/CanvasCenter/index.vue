<template>
  <div 
    ref="wrapperRef" 
    @mousedown="$event => addDrawAreaFocus($event)"
    v-contextmenu="contextmenus" 
    v-click-outside="remDrawAreaFocus"
  >
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useFabricStore, useMainStore } from '@/store'
import { initEvent } from '@/views/Event/index'

import { contextmenus } from '@/configs/contextMenu'
import useCanvas from '@/views/Canvas/useCanvas'
import useCanvasHotkey from '@/hooks/useCanvasHotkey'
const fabricStore = useFabricStore()
const mainStore = useMainStore()
const [ canvas, initEditor ] = useCanvas()
const { wrapperRef, canvasRef } = storeToRefs(fabricStore)
const { drawAreaFocus } = storeToRefs(mainStore)
useCanvasHotkey()

onMounted(() => {
  initEditor()
  // initEvent()
})

// 点击画布区域
const addDrawAreaFocus = (e: MouseEvent) => {
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
</style>
