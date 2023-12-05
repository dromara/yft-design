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
        <ColorPicker :modelValue="handleElement.stroke" @update:modelValue="(color: string) => updateStrokeColor(color)"/>
      </el-popover>
    </div>
    <div class="row">
      <div style="flex: 2;">线条宽度：</div>
      <el-input-number :min="1" style="flex: 3;" v-model="handleElement.strokeWidth" @change="updateTemplateElement"></el-input-number>
    </div>
    
    <div class="row">
      <div style="flex: 2;">起点样式：</div>
      <el-select style="flex: 3;" v-model="handleElement.startStyle" @change="(value: string) => updateLineStyle(value, 'start')">
        <el-option value="0" label="无"></el-option>
        <el-option value="triangle" label="箭头"></el-option>
        <el-option value="circle" label="圆点"></el-option>
      </el-select>
    </div>
    <div class="row">
      <div style="flex: 2;">终点样式：</div>
      <el-select style="flex: 3;" v-model="handleElement.endStyle" @change="(value: string) => updateLineStyle(value, 'end')">
        <el-option value="0" label="无"></el-option>
        <el-option value="triangle" label="箭头"></el-option>
        <el-option value="circle" label="圆点"></el-option>
      </el-select>
    </div>

    <el-divider />
    <ElementShadow />
  </div>
</template>

<script lang="ts" setup>
import { propertiesToInclude, WorkSpaceName } from '@/configs/canvas'

import { useMainStore, useTemplatesStore } from '@/store'
import useCanvas from '@/views/Canvas/useCanvas'
import * as fabric from 'fabric'
import { LineElement } from '@/types/canvas'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import ElementPosition from '../Components/ElementPosition.vue'
import ElementShadow from '../Components/ElementShadow.vue'

const mainStore = useMainStore()
const templatesStore = useTemplatesStore()
const { canvasObject } = storeToRefs(mainStore)
const [ canvas ] = useCanvas()
const handleElement = computed(() => canvasObject.value as LineElement)
const lineStyle = ref<number>(0)

if (!handleElement.value.startStyle) handleElement.value.startStyle = '0'
if (!handleElement.value.endStyle) handleElement.value.endStyle = '0'

const updateStrokeColor = (color: string) => {
  if (!handleElement.value) return
  handleElement.value.stroke = color
  updateTemplateElement()
}

const changeLineStyle = () => {
  if (!handleElement.value) return
  handleElement.value.strokeDashArray = null
  if (lineStyle.value === 1) {
    handleElement.value.set({
      strokeDashArray: [6, 6]
    })
  }
  updateTemplateElement()
}

const updateTemplateElement = () => {
  const lineElement = handleElement.value as fabric.Object
  const props = lineElement.toObject(propertiesToInclude)
  templatesStore.updateElement({ id: props.id,  props})
  
}

const updateLineStyle = (value: string, mode: 'start' | 'end') => {
  if (value === `triangle`) {
    createTriangleElement(mode)
  } 
  else if (value === `circle`) {
    createCircleElement(mode)
  }
  else {
    deleteLineElement(mode)
  }
}

const createTriangleElement = (mode: 'start' | 'end') => {
  const lineHeight = handleElement.value.height ? handleElement.value.height : 0
  const lineLeft = handleElement.value.left ? handleElement.value.left : 0
  const triangleLeft = mode === 'start' ? lineLeft - lineHeight / 2 : lineLeft + lineHeight / 2
  const [ canvas ] = useCanvas()
  const triangle = new fabric.Triangle({
    // @ts-ignore
    id: `${handleElement.value.id}-${mode}-triangle`,
    angle: handleElement.value.angle, 
    fill: handleElement.value.stroke, 
    top: handleElement.value.top, 
    left: triangleLeft, 
    height: 10, 
    width: 20, 
    originX: 'left', 
    originY: 'top', 
    selectable: false,
    name: 'triangle'
  })
  canvas.add(triangle)
  canvas.renderAll()
  if (mode === 'start') {
    handleElement.value.startStyle = 'triangle'
  } 
  else {
    handleElement.value.endStyle = 'triangle'
  }
  
  deleteLinePathElement(mode, 'circle')
}

const createCircleElement = (mode: 'start' | 'end') => {
  const lineHeight = handleElement.value.height ? handleElement.value.height : 0
  const lineLeft = handleElement.value.left ? handleElement.value.left : 0
  const triangleLeft = mode === 'start' ? lineLeft - lineHeight / 2 : lineLeft + lineHeight / 2
  const [ canvas ] = useCanvas()
  const circle = new fabric.Circle({
    id: `${handleElement.value.id}-${mode}-circle`,
    angle: handleElement.value.angle, 
    fill: handleElement.value.stroke, 
    top: handleElement.value.top, 
    left: triangleLeft, 
    radius: 10,
    originX: 'left', 
    originY: 'top', 
    selectable: false,
    name: 'circle'
  })
  canvas.add(circle)
  canvas.renderAll()
  // const circleElement = circle.toObject(propertiesToInclude)
 
  if (mode === 'start') {
    handleElement.value.startStyle = 'circle'
  } 
  else {
    handleElement.value.endStyle = 'circle'
  }
  
  deleteLinePathElement(mode, 'triangle')
}

const deleteLineElement = (mode: 'start' | 'end') => {
  const lineElementIds = [`${handleElement.value.id}-${mode}-triangle`, `${handleElement.value.id}-${mode}-circle`]
  // @ts-ignore
  canvas.remove(...canvas.getObjects().filter(obj => lineElementIds.includes(obj.id)))
  canvas.renderAll()
  templatesStore.deleteElement(lineElementIds)
  
}

const deleteLinePathElement = (mode: 'start' | 'end', path: 'triangle' | 'circle') => {
  const lineElementIds = [`${handleElement.value.id}-${mode}-${path}`]
  // @ts-ignore
  canvas.remove(...canvas.getObjects().filter(obj => lineElementIds.includes(obj.id)))
  canvas.renderAll()
  templatesStore.deleteElement(lineElementIds)
  
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