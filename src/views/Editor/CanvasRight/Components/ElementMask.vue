<template>
  <div class="element-color-mask">
    <div class="row">
      <div style="flex: 1;"><b>启用蒙版：</b></div>
      <div class="switch-wrapper" style="flex: 1;">
        <el-switch v-model="hasColorMask" @change="toggleColorMask(hasColorMask)"></el-switch>
      </div>
    </div>
    <template v-if="hasColorMask">
      <!-- <div class="row" style="margin-top: 15px;">
        <div style="flex: 2;">蒙版颜色：</div>
        <el-popover trigger="click" width="265">
          <template #reference>
            <ColorButton :color="maskColor" style="flex: 3;" />
          </template>
          <ColorPicker :modelValue="maskColor" @update:modelValue="color => updateMaskColor(color)"/>
        </el-popover>
      </div> -->
      <el-row>
        <el-col :span="7" class="slider-name">蒙版颜色：</el-col>
        <el-col :span="3"></el-col>
        <el-col :span="14">
          <el-popover trigger="click" width="265">
            <template #reference>
              <ColorButton :color="maskColor" style="flex: 3;" />
            </template>
            <ColorPicker :modelValue="maskColor" @update:modelValue="color => updateMaskColor(color)"/>
          </el-popover>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" class="slider-name">不透明度：</el-col>
        <el-col :span="3"></el-col>
        <el-col :span="10">
          <el-slider class="slider" v-model="maskAlpha" :min="0" :max="1" :step="0.01" @change="updateMaskAlpha"></el-slider>
        </el-col>
        <el-col :span="4" class="slider-num">{{ maskAlpha }}</el-col>
      </el-row>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { ImageElement } from '@/types/canvas'
import { filters, Gradient } from 'fabric'
import useCanvas from '@/views/Canvas/useCanvas'

const BlendColorFilter = 'BlendColor'
const maskColor = ref('')
const maskAlpha = ref(0.3)
const [ canvas ] = useCanvas()
const { canvasObject } = storeToRefs(useMainStore())

const hasColorMask = ref(false)
const handleElement = computed(() => canvasObject.value as ImageElement)

const updateMaskColor = (color: string) => {
  maskColor.value = color
  changeImageFilter()
}

const updateMaskAlpha = () => {
  changeImageFilter()
}

const changeImageFilter = () => {
  
  const blendFilter = new filters.BlendColor({
    color: maskColor.value,
    mode: 'add',
    alpha: maskAlpha.value
  })
  handleElement.value.filters = handleElement.value.filters?.filter(obj => obj.type !== BlendColorFilter)
  // @ts-ignore
  handleElement.value.filters?.push(blendFilter)
  handleElement.value.applyFilters()
  canvas.renderAll()
}

// watch(handleElement, () => {
//   if (!handleElement.value || handleElement.value.type !== 'image') return
//   // @ts-ignore
//   const blendColorFilter = handleElement.value.filters?.filter(obj => obj.type === BlendColorFilter)[0] as filters.BlendColor
//   if (blendColorFilter) {
//     hasColorMask.value = true
//     maskColor.value = blendColorFilter.color
//     maskAlpha.value = blendColorFilter.alpha
//   }
//   else {
//     hasColorMask.value = false
//   }
// })

const toggleColorMask = (status: boolean) => {
  if (!handleElement.value) return
  const [ canvas ] = useCanvas()
  hasColorMask.value = status
  if (hasColorMask.value) {
    // @ts-ignore
    const blendColorFilter = handleElement.value.filters?.filter(obj => obj.type === BlendColorFilter)[0]
    if (!blendColorFilter) {
      const blendFilter = new filters.BlendColor({
        color: maskColor.value,
        mode: 'add',
        alpha: maskAlpha.value
      })
      handleElement.value.filters.push(blendFilter)
      handleElement.value.applyFilters()
    }
  }
  else {
    handleElement.value.filters = handleElement.value.filters?.filter(obj => obj.type !== BlendColorFilter)
    handleElement.value.applyFilters()
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
.opacity-slider {
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