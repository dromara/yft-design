<template>
  <div>
    <div class="menu-content" :class="{ 'menu-close': poolShow !== true }">
      <component :is="currentComponent" class="menu-pool"></component>
      <div class="layout-toggle" @click="leftToggle" v-show="currentComponent">
        <IconLeft  class="toggle-icon" v-if="poolShow"/>
        <IconRight class="toggle-icon" v-else/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import TemplatePool from './components/TemplatePool.vue'
import MaterialPool from './components/MaterialPool.vue'
import TextboxPool from './components/TextboxPool.vue'
import ImagePool from './components/ImagePool.vue'
import ToolkitPool from './components/ToolkitPool.vue'
import LayerPool from './components/LayerPool.vue'
import CodePool from './components/CodePool.vue'

const mainStore = useMainStore()
const { lastHelp, lastEdit, poolType, poolShow } = storeToRefs(mainStore)

const leftMap = {
  'editor': null,
  'template': TemplatePool,
  'material': MaterialPool,
  'text': TextboxPool,
  'image': ImagePool,
  'illustration': ImagePool,
  'code': CodePool,
  'toolkit': ToolkitPool,
  'layer': LayerPool,
  'help': null,
}
const currentComponent = computed(() => {
  if (poolType.value === 'help') return leftMap[lastHelp.value]
  if (poolType.value === 'editor') return leftMap[lastEdit.value]
  return leftMap[poolType.value] || null
})



const leftToggle = () => {
  // if (poolType.value === 'editor' && !poolShow.value) return
  poolShow.value = !poolShow.value
}

</script>

<style lang="scss" scoped>
.menu-content {
  position: absolute;
  width: 300px;
  left: 50px;
  top: 42px;
  z-index: 1;
  background: #fff;
  border-left: 1px solid $borderColor;
  border-right: 1px solid $borderColor;
  border-bottom: 1px solid $borderColor;
  transition: left 0.5s linear, right 0.5s linear;
}
.menu-pool {
  width: 300px;
  height: 100vh;
  transition: left .3s linear;
  border-bottom: 1px solid $borderColor;
}
.menu-close {
  cursor: default;
  left: -251px;
  top: calc(50% + 42px);
  transform: translateY(-50%);
  position: absolute;;
  // z-index: 1;
}
.layout-toggle {
  background: $themeColor;
  cursor: pointer;
  height: 88px;
  position: absolute;
  right: -16px;
  top: 50%;
  transform: translateY(-50%);
  transition: right .1s linear;
  width: 16px;
  z-index: 1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  display: flex;
  align-items: center;
  border-top: 1px solid $borderColor;
  border-bottom: 1px solid $borderColor;
  border-right: 1px solid $borderColor;
}
.toggle-icon {
  color: #fff;
}
</style>