<template>
  <div class="line-style-panel">
    <ElementPosition/>
    <el-divider />
    <div class="row">
      <div style="flex: 2;">线条样式：</div>
      <el-select style="flex: 3;" v-model="lineStyle" @change="changeLineStyle">
        <el-option :value="0" label="实线"></el-option>
        <el-option :value="1" label="虚线"></el-option>
      </el-select>
    </div>
    <div class="row">
      <div style="flex: 2;">线条颜色：</div>
      <el-popover trigger="click" width="265"> 
        <template #reference>
          <ColorButton :color="handleElement.stroke" style="flex: 3;" />
        </template>
        <ColorPicker :modelValue="handleElement.stroke" @update:modelValue="(color) => updateStrokeColor(color)"/>
      </el-popover>
    </div>
    <div class="row">
      <div style="flex: 2;">线条宽度：</div>
      <el-input-number :min="1" style="flex: 3;" v-model="handleElement.strokeWidth" @change="updateTemplateElement"></el-input-number>
    </div>
    
    <div class="row">
      <div style="flex: 2;">起点样式：</div>
      <el-select style="flex: 3;" v-model="handleElement.startStyle" @change="(value) => changeLineMode(value, 'start')">
        <el-option value="" label="无"></el-option>
        <el-option value="arrow" label="箭头"></el-option>
        <el-option value="dot" label="圆点"></el-option>
      </el-select>
    </div>
    <div class="row">
      <div style="flex: 2;">终点样式：</div>
      <el-select style="flex: 3;" v-model="handleElement.endStyle" @change="(value) => changeLineMode(value, 'end')">
        <el-option value="" label="无"></el-option>
        <el-option value="arrow" label="箭头"></el-option>
        <el-option value="dot" label="圆点"></el-option>
      </el-select>
    </div>

    <el-divider />
    <ElementShadow />
  </div>
</template>

<script lang="ts" setup>
import { useMainStore, useTemplatesStore } from '@/store'
import useCanvas from '@/views/Canvas/useCanvas'
import { Polyline } from '@/extension/object/Polyline'
import { LineElement } from '@/types/canvas'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import ElementPosition from '../Components/ElementPosition.vue'
import ElementShadow from '../Components/ElementShadow.vue'
import { LinePoint } from '@/types/elements'

const mainStore = useMainStore()
const templatesStore = useTemplatesStore()
const { canvasObject } = storeToRefs(mainStore)
const [ canvas ] = useCanvas()
const handleElement = computed(() => canvasObject.value as Polyline)
const lineStyle = ref<number>(handleElement.value.strokeDashArray ? 1 : 0)

const updateStrokeColor = (color: string) => {
  if (!handleElement.value) return
  handleElement.value.stroke = color
  updateTemplateElement()
}

const changeLineStyle = () => {
  if (!handleElement.value) return
  const strokeDashArray = lineStyle.value === 1 ? [6, 6] : null
  handleElement.value.set({strokeDashArray})
  updateTemplateElement()
}

const changeLineMode = (value: LinePoint, mode: 'start' | 'end') => {
  handleElement.value.setLineMode(value, mode)
  updateTemplateElement()
}

const updateTemplateElement = () => {
  canvas.renderAll()
  templatesStore.modifedElement()
}

</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.line-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 !important;

  .line-wrapper {
    margin-left: 8px;
  }
}
.line-wrapper {
  overflow: visible;
}
.line-btn-icon {
  width: 30px;
  font-size: 12px;
  margin-top: 2px;
  color: #bfbfbf;
}
.preset-point-style {
  padding: 0 10px;

  & + .preset-point-style {
    margin-top: 10px;
  }
}
</style>