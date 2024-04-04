<template>
  <div class="element-shadow">
    <div class="row">
      <div class="stroke-name"><b>启用描边：</b></div>
      <div class="stroke-option switch-wrapper">
        <el-switch v-model="openStroke" @change="toggleStroke()"></el-switch>
      </div>
    </div>
    <template v-if="openStroke">
      <div class="row">
        <div class="stroke-name">描边厚度：</div>
        <el-slider class="slider" v-model="handleElement.strokeWidth" @change="updateStrokeWidth"></el-slider>
      </div>
      <div class="row">
        <div class="stroke-name">描边样式：</div>
        <el-select class="stroke-option" v-model="handleElement.strokeLineCap" @change="updateStrokeLineCap">
          <el-option value="butt" label="butt"></el-option>
          <el-option value="round" label="round"></el-option>
          <el-option value="square" label="square"></el-option>
        </el-select>
      </div>
      <div class="row">
        <div class="stroke-name">描边颜色：</div>
        <el-popover trigger="click" width="265">
          <template #reference>
            <ColorButton :color="handleElement.stroke" class="stroke-option" />
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

const props = defineProps({
  hasStroke: {
    type: Boolean,
    required: true,
  },
})

const [ canvas ] = useCanvas()
const { canvasObject } = storeToRefs(useMainStore())


const handleElement = computed(() => canvasObject.value as TextboxElement)
const openStroke = ref(props.hasStroke)

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

const updateStrokeLineCap = (strokeLineCap: string) => {
  if (!handleElement.value) return
  handleElement.value.set({strokeLineCap})
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
.stroke-name {
  flex: 2;
}
.stroke-option {
  flex: 3;
}
.switch-wrapper {
  text-align: right;
}
.slider {
  flex: 3;
  width: 80%;
}
</style>