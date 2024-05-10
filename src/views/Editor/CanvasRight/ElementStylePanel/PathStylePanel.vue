<template>
  <div class="shape-style-panel">
    <ElementPosition/>
    <el-divider style="margin: 12px 0" />
    <ElementFill />
    <el-divider style="margin: 12px 0" />
    <ElementFlip />
    <!-- <el-divider style="margin: 12px 0" />
    <ElementClip /> -->
    <el-divider style="margin: 12px 0" />
    <ElementStroke :hasStroke="hasStroke" />
    <el-divider style="margin: 12px 0" />
    <ElementShadow :hasShadow="hasShadow" />
    <el-divider style="margin: 12px 0" />
    <ElementOpacity />
  </div>
</template>

<script lang="ts" setup>
import ElementPosition from '../Components/ElementPosition.vue'
import ElementOpacity from '../Components/ElementOpacity.vue'
import ElementOutline from '../Components/ElementOutline.vue'
import ElementShadow from '../Components/ElementShadow.vue'
import ElementFlip from '../Components/ElementFlip.vue'
import ElementClip from '../Components/ElementClip.vue'
import ElementText from '../Components/ElementText.vue'
import ElementStroke from '../Components/ElementStroke.vue'
import ElementFill from '../Backgrounds/ElementFill.vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { Path } from 'fabric'


const mainStore = useMainStore()
const { canvasObject } = storeToRefs(mainStore)
const handleElement = computed(() => canvasObject.value as Path) 
const hasShadow = computed(() => handleElement.value.shadow ? true : false)
const hasStroke = computed(() => handleElement.value.stroke ? true : false)
</script>

<style lang="scss" scoped>
.shape-style-panel {
  user-select: none;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.font-size-btn {
  padding: 0;
}
.slider {
  flex: 3;
}
.mb-10 {
  margin-bottom: 10px;
}
.full-row {
  flex: 1;
  width: 100%;
}

.gradient-box {
  display: flex;
  flex: 1;
  .el-button {
    width: 100%;
  }
}

.mt-10 {
  margin-top: 10px;
}
.full-group {
  display: flex;
  flex: 1;
  .el-button {
    width: 50%;
  }
}

.tooltip-popover {
  .el-button {
    width: 100%;
    border-radius: 0;
  }
  .font-color {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-right: 0;
  }
  .high-light {
    border-right: 0;
  }
}
.font-size {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>