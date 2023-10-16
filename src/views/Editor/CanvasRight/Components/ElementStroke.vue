<template>
  <div class="element-shadow">
    <div class="row">
      <div style="flex: 2;"><b>启用描边：</b></div>
      <div class="switch-wrapper" style="flex: 3;">
        <el-switch v-model="openStroke" @change="toggleStroke()"></el-switch>
      </div>
    </div>
    <template v-if="openStroke">
      <div class="row">
        <div style="flex: 2;">描边厚度：</div>
        <el-slider class="slider" v-model="handleElement.strokeWidth" @change="updateStrokeWidth"></el-slider>
      </div>
      <div class="row">
        <div style="flex: 2;">描边颜色：</div>
        <el-popover trigger="click" width="265">
          <template #reference>
            <ColorButton :color="handleElement.stroke" style="flex: 3;" />
          </template>
          <ColorPicker :modelValue="handleElement.stroke" @update:modelValue="(color: string) => updateStrokeColor(color)"/>
        </el-popover>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { TextboxElement } from '@/types/canvas'
import useCanvas from '@/views/Canvas/useCanvas'

const [ canvas ] = useCanvas()
const { canvasObject } = storeToRefs(useMainStore())


const handleElement = computed(() => canvasObject.value as TextboxElement)
const hasStroke = computed(() => handleElement.value.stroke ? true : false)
const openStroke = ref(hasStroke.value)

const updateStrokeColor = (stroke: string) => {
  if (!handleElement.value) return
  handleElement.value.set({stroke})
  canvas.renderAll()
}

const updateStrokeWidth = (strokeWidth: number) => {
  if (!handleElement.value) return
  handleElement.value.set({strokeWidth})
  canvas.renderAll()
}

const toggleStroke = () => {
  if (!handleElement.value) return
  const stroke = openStroke.value ? (!handleElement.value.stroke ? '#000' : '') : ''
  const strokeWidth = openStroke.value ? (!handleElement.value.stroke ? 1 : 0) : 0
  handleElement.value.set({stroke, strokeWidth})
  canvas.renderAll()
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.switch-wrapper {
  text-align: right;
}
.slider {
  flex: 3;
}
</style>