<template>
  <div class="element-shadow">
    <div class="row">
      <div style="flex: 2;"><b>启用阴影：</b></div>
      <div class="switch-wrapper" style="flex: 3;">
        <el-switch v-model="openShadow" @change="toggleShadow"></el-switch>
      </div>
    </div>
    <template v-if="openShadow">
      <el-row>
        <el-col :span="7" class="slider-name">水平阴影：</el-col>
        <el-col :span="3"></el-col>
        <el-col :span="10">
          <el-slider class="slider" v-model="offsetX" :min="1" :max="10" @change="changeOffsetX"></el-slider>
        </el-col>
        <el-col :span="4" class="slider-num">{{ offsetX }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="7" class="slider-name">垂直阴影：</el-col>
        <el-col :span="3"></el-col>
        <el-col :span="10">
          <el-slider class="slider" v-model="offsetY" :min="1" :max="10" @change="changeOffsetY"></el-slider>
        </el-col>
        <el-col :span="4" class="slider-num">{{ offsetY }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="7" class="slider-name">模糊距离：</el-col>
        <el-col :span="3"></el-col>
        <el-col :span="10">
          <el-slider class="slider" v-model="blur" :min="1" :max="10" @change="changeBlur"></el-slider>
        </el-col>
        <el-col :span="4" class="slider-num">{{ blur }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="7" class="slider-name">阴影颜色：</el-col>
        <el-col :span="3"></el-col>
        <el-col :span="14">
          <el-popover trigger="click" width="265">
            <template #reference>
              <ColorButton :color="shadowColor" style="flex: 3;" />
            </template>
            <ColorPicker :modelValue="shadowColor" @update:modelValue="(color: string) => updateShadowColor(color)"/>
          </el-popover>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import * as fabric from 'fabric'
import useCanvas from '@/views/Canvas/useCanvas'
import { CanvasElement } from '@/types/canvas'
const [ canvas ] = useCanvas()
const { canvasObject } = storeToRefs(useMainStore())

const offsetX = ref<number | undefined>(1)
const offsetY = ref<number | undefined>(1)
const blur = ref<number | undefined>(5)
const shadowColor = ref('#000000')

const handleElement = computed(() => canvasObject.value as CanvasElement)
const hasShadow = computed(() => {
  if (!handleElement.value) return false
  if (handleElement.value.shadow) {
    offsetX.value = (handleElement.value.shadow as fabric.Shadow).offsetX
    offsetY.value = (handleElement.value.shadow as fabric.Shadow).offsetY
    blur.value = (handleElement.value.shadow as fabric.Shadow).blur
    shadowColor.value = (handleElement.value.shadow as fabric.Shadow).color
    return true
  }
  return false
})
const openShadow = ref(hasShadow.value)


const updateShadowColor = (color: string) => {
  shadowColor.value = color
  updateShadowElement()
}

const changeOffsetX = () => {
  updateShadowElement()
}

const changeOffsetY = () => {
  updateShadowElement()
}

const changeBlur = () => {
  updateShadowElement()
}

const updateShadowElement = () => {
  const [ canvas ] = useCanvas()
  if (!handleElement.value) return
  handleElement.value.shadow = new fabric.Shadow({
    color: shadowColor.value,
    offsetX: offsetX.value,
    offsetY: offsetY.value,
    blur: blur.value
  })
  canvas.renderAll()
}

const toggleShadow = () => {
  if (!handleElement.value) return
  if (openShadow.value) {
    updateShadowElement()
  }
  else {
    handleElement.value.shadow = null
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
.slider-name {
  display: flex;
  align-items: center;
}
.slider-num{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>