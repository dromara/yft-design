<template>
  <div @click.stop="cancelElement">
    <el-row class="layout-search">
      <el-input :prefix-icon="Search" placeholder="搜索图层"></el-input>
    </el-row>
    <LayerDraggableSelf :elements="currentTemplate.objects" :index="0"></LayerDraggableSelf>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useTemplatesStore } from '@/store'

import LayerDraggableSelf from './LayerComponents/LayerDraggableSelf.vue'
import useHandleElement from '@/hooks/useHandleElement'
import useI18n from '@/hooks/useI18n'

const templatesStore = useTemplatesStore()
const { t } = useI18n()
const { currentTemplate } = storeToRefs(templatesStore)
const { cancelElement } = useHandleElement()
</script>

<style lang="scss" scoped>
.layout-search {
  margin: 0 auto;
  width: 68%;
  padding: 20px 10px 10px;
}
</style>