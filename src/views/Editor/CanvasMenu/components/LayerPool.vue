<template>
  <div @click.stop="cancelElement">
    <el-row class="layout-search">
      <el-input :prefix-icon="Search" placeholder="搜索图层"></el-input>
    </el-row>
    <LayerDraggableSelf :elements="currentTemplate.objects.filter(item => !WorkSpaceCommonType.includes(item.id))" :index="0"></LayerDraggableSelf>
    <!-- <LayerDraggableSelf :elements="elements" :index="0"></LayerDraggableSelf> -->
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTemplatesStore } from '@/store'
import { WorkSpaceCommonType } from '@/configs/canvas'
import LayerDraggableSelf from './LayerComponents/LayerDraggableSelf.vue'
import useHandleElement from '@/hooks/useHandleElement'

const templatesStore = useTemplatesStore()
const { currentTemplate } = storeToRefs(templatesStore)
const { cancelElement } = useHandleElement()
// const elements = computed(() => {
//   const [ canvas ] = useCanvas()
//   return canvas.getObjects().filter(item => !WorkSpaceCommonType.includes(item.id))
// })
</script>

<style lang="scss" scoped>
.layout-search {
  margin: 0 auto;
  width: 68%;
  padding: 20px 10px 10px;
}
</style>