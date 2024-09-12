<template>
  <div 
    ref="wrapperRef" 
    @mousedown="addDrawAreaFocus"
    v-contextmenu="contextMenus" 
    v-click-outside="remDrawAreaFocus"
    class="h-full w-full"
  >
    <canvas ref="canvasRef" class="background-grid"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted } from 'vue'
import { useFabricStore, useMainStore, useTemplatesStore } from '@/store'
import { useRouter } from 'vue-router'
import { unzip } from "@/utils/crypto"
import { getTemplateData } from '@/api/template'
import { contextMenus } from '@/configs/contextMenu'
import { initEditor } from '@/views/Canvas/useCanvas'
import { initPixi } from '@/views/Canvas/usePixi'
import { ElMessage, ElLoading } from 'element-plus'
import useCanvasHotkey from '@/hooks/useCanvasHotkey'
const fabricStore = useFabricStore()
const mainStore = useMainStore()
const router = useRouter()
const templatesStore = useTemplatesStore()
const { wrapperRef, canvasRef } = storeToRefs(fabricStore)
const { drawAreaFocus } = storeToRefs(mainStore)
const { keydownListener, keyupListener, pasteListener } = useCanvasHotkey()


const addDrawAreaFocus = () => {
  if (!drawAreaFocus.value) mainStore.setDrawAreaFocus(true)
}

const remDrawAreaFocus = () => {
  if (drawAreaFocus.value) mainStore.setDrawAreaFocus(false)
}

const getTemplateDetail = async (pk: number) => {
  const result = await getTemplateData(pk)
  if (result.data && result.data.code === 200 && result.data.data) {
    try {
      router.push(`${router.currentRoute.value.path}?template=${pk}`)
      console.log('result.data.data.id:', result.data.data.id)
      const data = unzip(result.data.data.data)
      await templatesStore.changeTemplate(data)
    } 
    catch (error) {
      ElMessage({
        type: 'error',
        message: '模板加载失败,请联系管理员修改bug了',
      })
    }
  }
}

const initRouter = async (templateId?: number) => {
  if (templateId) {
    templatesStore.setTemplateId(templateId)
    const loadingInstance = ElLoading.service({ fullscreen: true, background: 'rgba(122, 122, 122, 0.5)' })
    await getTemplateDetail(templateId)
    nextTick(() => loadingInstance.close())
  }
}

onMounted(async () => {
  const query = router.currentRoute.value.query
  initRouter(query.template)
  initEditor(query.template)
  initPixi()
  document.addEventListener('keydown', keydownListener)
  document.addEventListener('keyup', keyupListener)
  window.addEventListener('blur', keyupListener)
  window.addEventListener('paste', pasteListener as any)
})

onUnmounted(() => {
  document.removeEventListener('keydown', keydownListener)
  document.removeEventListener('keyup', keyupListener)
  window.removeEventListener('blur', keyupListener)
  window.removeEventListener('paste', pasteListener as any)
})

</script>

<style lang="scss" scoped>
.background-grid {
  --offsetX: 0px;
  --offsetY: 0px;
  --size: 8px;
  --color: #dedcdc;
  background-image: 
    linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0), 
    linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
  background-position: var(--offsetX) var(--offsetY), calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
  background-size: calc(var(--size) * 2) calc(var(--size) * 2);
}
</style>@/views/Canvas/usePixi
