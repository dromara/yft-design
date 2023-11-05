<template>
  <div class="element-color-mask">
    <div class="row">
      <div style="flex: 1;"><b>启用渐变：</b></div>
      <div class="switch-wrapper" style="flex: 1;">
        <el-switch v-model="hasGradient" @change="toggleColorMask(hasGradient)"></el-switch>
      </div>
    </div>
    <template v-if="hasGradient">
      <div class="row" style="margin-top: 15px;">
        <div style="flex: 2;">蒙版颜色：</div>
        <el-popover trigger="click" width="265">
          <template #reference>
            <ColorButton :color="maskColor" style="flex: 3;" />
          </template>
          <ColorPicker :modelValue="maskColor" @update:modelValue="(color: string) => updateMaskColor(color)"/>
        </el-popover>
      </div>
      <div class="row">
        <div style="flex: 2;">不透明度：</div>
        <el-slider class="opacity-slider" :min="0" :step="0.01" :max="1" v-model="maskAlpha" @change="updateMaskAlpha"></el-slider>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { ImageElement } from '@/types/canvas'
import { filters, Image } from 'fabric'
import useCanvas from '@/views/Canvas/useCanvas'

const BlendColorFilter = 'BlendColor'
const maskColor = ref('')
const maskAlpha = ref(0.3)

const { canvasObject } = storeToRefs(useMainStore())

const hasGradient = ref(false)
const handleElement = computed(() => canvasObject.value as Image)

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
}

const toggleColorMask = (status: boolean) => {
  if (!handleElement.value) return
  const [ canvas ] = useCanvas()
  
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
</style>