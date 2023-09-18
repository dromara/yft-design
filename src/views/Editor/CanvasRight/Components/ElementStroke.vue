<template>
  <div class="element-shadow">
    <div class="row">
      <div style="flex: 2;"><b>启用描边：</b></div>
      <div class="switch-wrapper" style="flex: 3;">
        <el-switch v-model="hasStroke" @change="toggleStroke()"></el-switch>
      </div>
    </div>
    <template v-if="hasStroke">
      <div class="row">
        <div style="flex: 2;">描边厚度：</div>
        <el-slider class="slider" v-model="handleStroke.strokeWidth"></el-slider>
      </div>
      <div class="row">
        <div style="flex: 2;">描边颜色：</div>
        <el-popover trigger="click" width="265">
          <template #reference>
            <ColorButton :color="handleStroke.stroke" style="flex: 3;" />
          </template>
          <ColorPicker :modelValue="handleStroke.stroke" @update:modelValue="color => updateStrokeColor(color)"/>
        </el-popover>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { TextboxElement } from '@/types/canvas'
import useCanvas from '@/views/Canvas/useCanvas'

const [ canvas ] = useCanvas()
const { canvasObject } = storeToRefs(useMainStore())


const hasStroke = ref(false)
const handleStroke = computed(() => canvasObject.value as TextboxElement)


const updateStrokeColor = (color: string) => {
  if (!canvasObject.value) return
  handleStroke.value.stroke = color
  canvas.renderAll()
}

const toggleStroke = () => {
  if (!handleStroke.value) return
  if (hasStroke.value) {
    if (!handleStroke.value.stroke) {
      handleStroke.value.stroke = '#000'
      handleStroke.value.strokeWidth = 1
    }
  }
  else {
    handleStroke.value.stroke = ''
    handleStroke.value.strokeWidth = 0
  }
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