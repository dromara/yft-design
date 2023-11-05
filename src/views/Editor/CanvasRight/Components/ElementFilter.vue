<template>
  <div class="element-filter">
    <div class="row">
      <div style="flex: 2;"><b>启用滤镜：</b></div>
      <div class="switch-wrapper" style="flex: 3;">
        <el-switch v-model="openFilter" @change="toggleFilters"></el-switch>
      </div>
    </div>
    <div class="filter" v-if="openFilter">
      <el-row class="mt-10">
        <el-col :span="5">灰度：</el-col>
      </el-row>
      <el-row class="mt-10">
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <el-radio-group class="full-ratio" v-model="elementGrayscale">
            <el-radio-button label="average" @click.prevent="changeGrayscaleMode('average')">平均</el-radio-button>
            <el-radio-button label="luminosity" @click.prevent="changeGrayscaleMode('luminosity')">光度</el-radio-button>
            <el-radio-button label="lightness" @click.prevent="changeGrayscaleMode('lightness')">明亮</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>

      <el-row class="mt-10">模式：</el-row>
      <el-row class="mt-10">
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <el-checkbox-group class="full-group" v-model="elementFilters" @change="changeFilters">
            <el-checkbox-button label="Invert">倒置</el-checkbox-button>
            <el-checkbox-button label="Sharpen">锐化</el-checkbox-button>
            <el-checkbox-button label="Emboss">凹凸</el-checkbox-button>
          </el-checkbox-group>
        </el-col>
      </el-row>
      
      <el-row class="mt-10">矩阵：</el-row>
      <el-row class="mt-10">
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <el-checkbox-group class="full-group" v-model="elementFilters" @change="changeFilters">
            <el-checkbox-button label="Sepia">棕褐色</el-checkbox-button>
            <el-checkbox-button label="BlackWhite">黑白色</el-checkbox-button>
            <el-checkbox-button label="Brownie">布朗尼</el-checkbox-button>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row class="mt-10">
        <el-col :span="2"></el-col>
        <el-col :span="22"> 
          <el-checkbox-group class="full-checkbox" v-model="elementFilters" @change="changeFilters">
            <el-checkbox-button label="Vintage">年份色</el-checkbox-button>
            <el-checkbox-button label="Technicolor">特艺彩</el-checkbox-button>
            <el-checkbox-button label="Kodachrome">柯达彩</el-checkbox-button>
            <el-checkbox-button label="Polaroid">宝丽来</el-checkbox-button>
          </el-checkbox-group>
        </el-col>
      </el-row>      

      <!-- <el-row class="mt-10">去除：</el-row>
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="5" class="flex-align">颜色：</el-col>
        <el-col :span="2"></el-col>
        <el-col :span="15">
          <el-popover trigger="click" width="265">
            <template #reference>
              <ColorButton :color="removeColor.color" style="flex: 3;" />
            </template>
            <ColorPicker :modelValue="removeColor.color" @update:modelValue="color => updateRemoveColor(color)"/>
          </el-popover>
        </el-col>
      </el-row> 
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="5" class="flex-align">距离：</el-col>
        <el-col :span="2"></el-col>
        <el-col :span="15">
          <el-slider class="slider-wrapper" :min="0" :max="1" :step="0.01" v-model="removeColor.distance" @change="updateRemoveDistance"></el-slider>
        </el-col>
      </el-row> -->

      <el-row class="mt-10">色彩：</el-row>
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="5" class="flex-align">亮度：</el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <el-slider class="slider-wrapper" :min="-1" :max="1" :step="0.01" v-model="brightness" @change="(value: number) => changeColorMode('Brightness', value)"></el-slider>
        </el-col>
        <el-col :span="4" class="slider-num">{{ brightness }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="5" class="flex-align">对比：</el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <el-slider class="slider-wrapper" :min="-1" :max="1" :step="0.01" v-model="contrast" @change="(value: number) => changeColorMode('Contrast', value)"></el-slider>
        </el-col>
        <el-col :span="4" class="slider-num">{{ contrast }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="5" class="flex-align">饱和：</el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <el-slider class="slider-wrapper" :min="-1" :max="1" :step="0.01" v-model="saturation" @change="(value: number) => changeColorMode('Saturation', value)"></el-slider>
        </el-col>
        <el-col :span="4" class="slider-num">{{ saturation }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="5" class="flex-align">鲜艳：</el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <el-slider class="slider-wrapper" :min="-1" :max="1" :step="0.01" v-model="vibrance" @change="(value: number) => changeColorMode('Vibrance', value)"></el-slider>
        </el-col>
        <el-col :span="4" class="slider-num">{{ vibrance }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="5" class="flex-align">色调：</el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <el-slider class="slider-wrapper" :min="-2" :max="2" :step="0.002" v-model="hue" @change="(value: number) => changeColorMode('Hue', value)"></el-slider>
        </el-col>
        <el-col :span="4" class="slider-num">{{ hue }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="5" class="flex-align">噪音：</el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <el-slider class="slider-wrapper" :min="0" :max="1000" :step="100" v-model="noise" @change="(value: number) => changeColorMode('Noise', value)"></el-slider>
        </el-col>
        <el-col :span="4" class="slider-num">{{ noise }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="5" class="flex-align">像素：</el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <el-slider class="slider-wrapper" :min="2" :max="20" :step="1" v-model="pixelate" @change="(value: number) => changeColorMode('Pixelate', value)"></el-slider>
        </el-col>
        <el-col :span="4" class="slider-num">{{ pixelate }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="5" class="flex-align">模糊：</el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <el-slider class="slider-wrapper" :min="-1" :max="1" :step="0.01" v-model="blur" @change="(value: number) => changeColorMode('Blur', value)"></el-slider>
        </el-col>
        <el-col :span="4" class="slider-num">{{ blur }}</el-col>
      </el-row>

      <!-- <el-row class="mt-10">
        <el-col :span="8" class="flex-align">伽马射线：</el-col>
        <el-col :span="16" class="flex-right">
          <el-switch v-model="isGamma" @change="openGamaColor"></el-switch>
        </el-col>
      </el-row>
      <el-row v-show="isGamma">
        <el-col :span="2"></el-col>
        <el-col :span="5" class="flex-align">红色：</el-col>
        <el-col :span="2"></el-col>
        <el-col :span="15">
          <el-slider class="slider-wrapper" :min="0.2" :max="2.2" :step="0.003921" v-model="gammaColor.red" @change="(value) => updateGammaColor('red', value)"></el-slider>
        </el-col>
      </el-row>
      <el-row v-show="isGamma">
        <el-col :span="2"></el-col>
        <el-col :span="5" class="flex-align">绿色：</el-col>
        <el-col :span="2"></el-col>
        <el-col :span="15">
          <el-slider class="slider-wrapper" :min="0.2" :max="2.2" :step="0.003921" v-model="gammaColor.green" @change="(value) => updateGammaColor('green', value)"></el-slider>
        </el-col>
      </el-row>
      <el-row v-show="isGamma">
        <el-col :span="2"></el-col>
        <el-col :span="5" class="flex-align">蓝色：</el-col>
        <el-col :span="2"></el-col>
        <el-col :span="15">
          <el-slider class="slider-wrapper" :min="0.2" :max="2.2" :step="0.003921" v-model="gammaColor.blue" @change="(value) => updateGammaColor('blue', value)"></el-slider>
        </el-col>
      </el-row> -->

      <!-- <el-row class="mt-10">混合图片：</el-row>
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="5" class="flex-align">模式：</el-col>
        <el-col :span="2"></el-col>
        <el-col :span="15">
          <el-select>
            <el-option value="0"></el-option>
          </el-select>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="5" class="flex-align">透明：</el-col>
        <el-col :span="2"></el-col>
        <el-col :span="15">
          <el-slider class="slider-wrapper"></el-slider>
        </el-col>
        <el-col :span="4" class="slider-num">{{ brightness }}</el-col>
      </el-row> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { filters, Image } from 'fabric'
import { ImageElement } from '@/types/canvas'
import { ElementNames } from '@/types/elements'
import { SharpenMatrix, EmbossMatrix, GrayscaleType } from '@/configs/images'
import useCanvas from '@/views/Canvas/useCanvas'

const [ canvas ] = useCanvas()
const { canvasObject } = storeToRefs(useMainStore())
const handleElement = computed(() => canvasObject.value as Image)

interface FilterOption {
  label: string
  key: string
  default: number
  value: number
  unit: string
  max: number
  step: number
}

const defaultFilters: FilterOption[] = [
  { label: '模糊', key: 'blur', default: 0, value: 0, unit: 'px', max: 10, step: 1 },
  { label: '亮度', key: 'brightness', default: 100, value: 100, unit: '%', max: 200, step: 5 },
  { label: '对比度', key: 'contrast', default: 100, value: 100, unit: '%', max: 200, step: 5 },
  { label: '灰度', key: 'grayscale', default: 0, value: 0, unit: '%', max: 100, step: 5 },
  { label: '饱和度', key: 'saturate', default: 100, value: 100, unit: '%', max: 200, step: 5 },
  { label: '色相', key: 'hue-rotate', default: 0, value: 0, unit: 'deg', max: 360, step: 10 },
  { label: '透明度', key: 'opacity', default: 100, value: 100, unit: '%', max: 100, step: 5 },
]

interface RemoveColorOption {
  distance: number
  color: string
} 

interface GammaColorOption {
  red: number
  green: number
  blue: number
}

const imageFilters = computed(() => {
  let filters: string[] = []
  handleElement.value.filters.forEach(item => {
    if (item.type === 'Convolute') {
      const itemMatrix = (item as filters.Convolute).matrix
      if (itemMatrix.length === SharpenMatrix.length && itemMatrix.every((v, i) => v === SharpenMatrix[i])) {
        filters.push('Sharpen')
      }
      if (itemMatrix.length === EmbossMatrix.length && itemMatrix.every((v, i) => v === EmbossMatrix[i])) {
        filters.push('Emboss')
      }
    } 
    else {
      if (!filters.includes(item.type)) filters.push(item.type)
    }
  })
  return filters
})

const imageGrayscale = computed(() => {
  let grayscale = ''
  handleElement.value.filters.forEach(item => {
    if (item.type === GrayscaleType) {
      grayscale = (item as filters.Grayscale).mode
    }
  })
  return grayscale
})

const elementGrayscale = ref<string>(imageGrayscale.value)
const elementFilters = ref<string[]>(imageFilters.value)

// 灰度
// const grayScaleMode = ref<string>('')  // 'average' | 'luminosity' | 'lightness' | ''
// 移除色
const removeColor = ref<RemoveColorOption>({ distance: 0.5, color: '#fff'})
// 伽马色
const isGamma = ref(false)
const gammaColor = ref<GammaColorOption>({ red: 0.2, green: 0.2, blue: 0.2 })
const brightness = ref(0)    // 亮度
const contrast = ref(0)      // 对比
const saturation = ref(0)    // 饱和
const vibrance = ref(0)      // 鲜艳
const hue = ref(0)           // 色调
const noise = ref(0)         // 噪音
const pixelate = ref(0)      // 像素
const blur = ref(0)          // 模糊
// 矩阵
// const colorMatrix = ref<string[]>(JSON.parse(JSON.stringify(defaultFilters)))
// const hasFilters = ref(false)

const hasFilter = computed(() => {
  if (!handleElement.value) return false
  const elementType = handleElement.value.name ? handleElement.value.name : handleElement.value.type
  if (elementType !== ElementNames.IMAGE) return false
  const filters = handleElement.value.filters.filter(obj => obj.type !== 'BlendColor')
  if (filters && filters.length > 0) return true
  return false
})

const openFilter = ref<boolean>(hasFilter.value)

// 图片灰度
const changeGrayscaleMode = (mode: string) => {
  
  if (!handleElement.value) return
  if (!handleElement.value.filters) handleElement.value.filters = []
  mode === elementGrayscale.value ? elementGrayscale.value = '' : elementGrayscale.value = mode
  if (elementGrayscale.value) {
    handleElement.value.filters.push(new filters.Grayscale({mode: elementGrayscale.value}) as filters.BaseFilter)
    elementFilters.value.push(GrayscaleType)
  }
  else {
    handleElement.value.filters = handleElement.value.filters.filter(obj => obj.type !== GrayscaleType)
    elementFilters.value = elementFilters.value.filter(obj => obj !== GrayscaleType)
  }
  handleElement.value.applyFilters()
  canvas.renderAll()
}

const changeFilters = () => {
  if (!handleElement.value) return
  elementFilters.value.forEach(item => {
    const itemFilter = handleElement.value.filters.filter(obj => obj.type === item)[0]
    if (!itemFilter) {
      if (item === 'Invert') {
        handleElement.value.filters.push(new filters.Invert() as filters.BaseFilter)
      }
      else if (item === 'Sepia') {
        // @ts-ignore
        handleElement.value.filters.push(new filters.Sepia())
      }
      else if (item === 'BlackWhite') {
        // @ts-ignore
        handleElement.value.filters.push(new filters.BlackWhite())
      }
      else if (item === 'Brownie') {
        // @ts-ignore
        handleElement.value.filters.push(new filters.Brownie())
      }
      else if (item === 'Vintage') {
        // @ts-ignore
        handleElement.value.filters.push(new filters.Vintage())
      }
      else if (item === 'Technicolor') {
        // @ts-ignore
        handleElement.value.filters.push(new filters.Technicolor())
      }
      else if (item === 'Kodachrome') {
        // @ts-ignore
        handleElement.value.filters.push(new filters.Kodachrome())
      }
      else if (item === 'Polaroid') {
        // @ts-ignore
        handleElement.value.filters.push(new filters.Polaroid())
      }
    }
  })
  handleElement.value.filters = handleElement.value.filters.filter(obj => elementFilters.value.includes(obj.type))
  
  if (elementFilters.value.includes('Sharpen')) {
    handleElement.value.filters.push(new filters.Convolute({matrix: SharpenMatrix}) as filters.BaseFilter)
  }
  if (elementFilters.value.includes('Emboss')) {
    handleElement.value.filters.push(new filters.Convolute({matrix: EmbossMatrix}) as filters.BaseFilter)
  }
  handleElement.value.applyFilters()
  canvas.renderAll()
}

// 更新去除色
const updateRemoveColor = (color: string) => {
  if (!handleElement.value) return
  if (!handleElement.value.filters) handleElement.value.filters = []
  const removeColorFilter = new filters.RemoveColor({
    distance: removeColor.value.distance,
    color: removeColor.value.color,
  })
  removeColor.value.color = color
  handleElement.value.filters = handleElement.value.filters.filter(obj => obj.type !== 'RemoveColor')
  handleElement.value.filters.push(removeColorFilter as filters.BaseFilter)
  handleElement.value.applyFilters()
}

// 更新去除距离
const updateRemoveDistance = () => {
  if (!handleElement.value) return
  if (!handleElement.value.filters) handleElement.value.filters = []
  const removeColorFilter = new filters.RemoveColor({
    distance: removeColor.value.distance,
    color: removeColor.value.color,
  })
  handleElement.value.filters = handleElement.value.filters.filter(obj => obj.type !== 'RemoveColor')
  handleElement.value.filters.push(removeColorFilter as filters.BaseFilter)
  handleElement.value.applyFilters()
}

// 更新伽马色
const updateGammaColor = (type: string, value: number) => {
  if (!handleElement.value) return
  if (!handleElement.value.filters) handleElement.value.filters = []
  if (type === 'red') {
    gammaColor.value.red = value
  }
  else if (type === 'green') {
    gammaColor.value.green = value
  }
  else {
    gammaColor.value.blue = value
  }
  const gammaColorFilter = new filters.Gamma({
    gamma: [gammaColor.value.red, gammaColor.value.green, gammaColor.value.blue]
  })
  handleElement.value.filters = handleElement.value.filters.filter(obj => obj.type !== 'Gamma')
  // @ts-ignore
  handleElement.value.filters.push(gammaColorFilter)
  handleElement.value.applyFilters()
}

// 开关伽马颜色
const openGamaColor = () => {
  if (!handleElement.value) return
  if (!handleElement.value.filters) handleElement.value.filters = []
  if (!isGamma.value) {
    handleElement.value.filters = handleElement.value.filters.filter(obj => obj.type !== 'Gamma')
    handleElement.value.applyFilters()
  } 
  else {
    updateGammaColor('red', 0.2)
  }
}

// 修改色彩模式
const changeColorMode = (type: string, value: number) => {
  if (!handleElement.value) return
  if (type === 'Brightness') {
    brightness.value = value
    const brightnessFilter = new filters.Brightness({brightness: brightness.value})
    handleElement.value.filters = handleElement.value.filters.filter(obj => obj.type !== type)
    handleElement.value.filters.push(brightnessFilter as filters.BaseFilter)
  }
  else if (type === 'Contrast') {
    contrast.value = value
    const contrastFilter = new filters.Contrast({contrast: contrast.value})
    handleElement.value.filters = handleElement.value.filters.filter(obj => obj.type !== type)
    handleElement.value.filters.push(contrastFilter as filters.BaseFilter)
  }
  else if (type === 'Saturation') {
    saturation.value = value
    const saturationFilter = new filters.Saturation({saturation: saturation.value})
    handleElement.value.filters = handleElement.value.filters.filter(obj => obj.type !== type)
    handleElement.value.filters.push(saturationFilter as filters.BaseFilter)
  }
  else if (type === 'Vibrance') {
    vibrance.value = value
    const vibranceFilter = new filters.Vibrance({vibrance: vibrance.value})
    handleElement.value.filters = handleElement.value.filters.filter(obj => obj.type !== type)
    handleElement.value.filters.push(vibranceFilter as filters.BaseFilter)
  }
  else if (type === 'Hue') {
    hue.value = value
    const hueFilter = new filters.HueRotation({rotation: hue.value})
    handleElement.value.filters = handleElement.value.filters.filter(obj => obj.type !== type)
    handleElement.value.filters.push(hueFilter as filters.BaseFilter)
  }
  else if (type === 'Noise') {
    noise.value = value
    const noiseFilter = new filters.Noise({noise: noise.value})
    handleElement.value.filters = handleElement.value.filters.filter(obj => obj.type !== type)
    handleElement.value.filters.push(noiseFilter as filters.BaseFilter)
  }
  else if (type === 'Pixelate') {
    pixelate.value = value
    const pixelateFilter = new filters.Pixelate({blocksize: pixelate.value})
    handleElement.value.filters = handleElement.value.filters.filter(obj => obj.type !== type)
    handleElement.value.filters.push(pixelateFilter as filters.BaseFilter)
  }
  else if (type === 'Blur') {
    blur.value = value
    const blurFilter = new filters.Blur({blur: blur.value})
    handleElement.value.filters = handleElement.value.filters.filter(obj => obj.type !== type)
    handleElement.value.filters.push(blurFilter as filters.BaseFilter)
  }
  handleElement.value.applyFilters()
  canvas.renderAll()
}

const toggleFilters = (checked: boolean) => {
  if (!handleElement.value) return
  if (checked) {
    defaultFilters.forEach(item => {
      changeColorMode(item.key, item.value)
    })
  }
  else {
    handleElement.value.filters.length = 0
    handleElement.value.applyFilters()
    canvas.renderAll()
  }
  
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  // margin-bottom: 10px;
}
.switch-wrapper {
  text-align: right;
}
.filter {
  font-size: 12px;
}
.filter-item {
  padding: 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .name {
    width: 60px;
  }
  .filter-slider {
    flex: 1;
    margin: 0 6px;
  }
}
.slider-num{
  display: flex;
  align-items: center;
  justify-content: center;
}
.flex-align {
  display: flex;
  align-items: center;
}
.flex-right {
  text-align: right;
}
.mt-10 {
  margin-top: 10px;
} 
.full-group {
  display: flex;
  flex: 1;
  .el-checkbox-button {
    width: 50%;
  }
}
.full-checkbox {
  display: flex;
  flex: 1;
  .el-checkbox-button {
    width: 25%;
  }
}
.full-ratio {
  display: flex;
  flex: 1;
  .el-radio-button {
    position: relative;
    display: inline-flex;
    outline: 0;
  }
  .el-radio-button__inner {
    width: 100%
  }
}
.slider-wrapper {
  width: 88%;
  margin: 0 auto;
}
</style>
<style scoped>
:deep(.full-group .el-checkbox-button__inner) {
  width: 100%;
}
:deep(.full-checkbox .el-checkbox-button__inner) {
  width: 100%;
  padding: 8px 0;
}

:deep(.full-ratio .el-radio-button__inner) {
  width: 100%;
}
:deep(.full-ratio .el-radio-button) {
  position: relative;
  display: inline-flex;
  outline: 0;
  flex: 1;
  width: 25%
}
</style>