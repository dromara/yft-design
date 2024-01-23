<template>
  <div class="background-content">
    <div class="row">
      <el-row>
        <el-col :span="11">
          <el-select v-model="background.fillType" @change="changeBackgroundType">
            <el-option v-for="item in BackgroundFillMode" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2"></el-col>

        <el-col :span="11" v-if="background.fillType === 0">
          <el-popover trigger="click" placement="bottom" :width="265">
            <template #reference>
              <ColorButton :color="background.fill || '#fff'"/>
            </template>
            <ColorPicker :modelValue="background.fill" @update:modelValue="(color: string) => updateBackground({color: color, fill: color})"/>
          </el-popover>
        </el-col>

        <el-col :span="11" v-else-if="background.fillType === 1">
          <el-select v-model="background.imageSize" @change="changeImageSize">
            <el-option v-for="item in BackgroundFillImageMode" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>

        <el-col :span="11" v-else-if="background.fillType === 2">
          <el-select v-model="background.gradientType" @change="changeGradientType">
            <el-option v-for="item in BackgroundFillGradientMode" :key="item.id" :value="item.value" :label="item.name"></el-option>
          </el-select>
        </el-col>

        <el-col :span="11" v-else-if="background.fillType === 3">
          <el-select v-model="gridColorMode" @change="changeGridColorMode">
            <el-option v-for="item in BackgroundFillGridMode" :key="item.id" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-col>

        <el-col :span="11" v-else-if="background.fillType === 4">
          <el-button class="full-row" @click="generateShadingBackgroundRandom">随机形状</el-button>
        </el-col>
      </el-row>
    </div>
    
    <!-- 图片填充 -->
    <div v-if="background.fillType === 1">
      <FileInput @change="(files: FileList) => uploadBackgroundImage(files)" class="mb-10">
        <div class="background-image">
          <div class="content" :style="{ backgroundImage: `url(${background.imageURL})` }">
            <IconPlus />
          </div>
        </div>
      </FileInput>
    </div>

    <!-- 渐变填充 -->
    <div v-if="background.fillType === 2">
      <div class="background-gradient-body">
        <div class="gradient-content" v-for="(item, nameIndex) in GradientColorLibs" :key="nameIndex" :value="item.name" @click.stop="changeGradientName(item.name)">
          <GradientFill :name="item.name" :type="background.gradientType" :colors="item.colors"></GradientFill>
        </div>
      </div>
      <el-row>
        <el-col :span="7" class="slider-name">不透明度：</el-col>
        <el-col :span="13">
          <el-slider class="common-slider" :min="0" :max="1" :step="0.01" v-model="gradientOpacity" @change="generateGradientBackground"/>
        </el-col>
        <el-col :span="4" class="slider-num">{{ gradientOpacity }}</el-col>
      </el-row>
      <el-row v-if="background.gradientType === 'linear'">
        <el-col :span="7" class="slider-name">渐变角度：</el-col>
        <el-col :span="13">
          <el-slider class="common-slider" :min="0" :max="360" :step="1" v-model="gradientRotate" @change="generateGradientBackground"/>
        </el-col>
        <el-col :span="4" class="slider-num">{{ gradientRotate }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="7" class="slider-name">水平位置：</el-col>
        <el-col :span="13">
          <el-slider class="common-slider" :min="0" :max="1" :step="0.01" v-model="gradientOffsetX" @change="generateGradientBackground"/>
        </el-col>
        <el-col :span="4" class="slider-num">{{ gradientOffsetX }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="7" class="slider-name">垂直位置：</el-col>
        <el-col :span="13">
          <el-slider class="common-slider" :min="0" :max="1" :step="0.01" v-model="gradientOffsetY" @change="generateGradientBackground"/>
        </el-col>
        <el-col :span="4" class="slider-num">{{ gradientOffsetY }}</el-col>
      </el-row>
      <div class="row">
        <div v-for="(item, index) in background.gradientColor" :key="index" class="gradient-box">
          <el-popover trigger="click" width="265">
            <template #reference>
              <ColorButton :color="item.color || '#fff'"/>
            </template>
            <ColorPicker :modelValue="item.color" @update:modelValue="(color: string) => updateGradientBackground(index, color)"/>
          </el-popover>
        </div>
      </div>
    </div>

    <!-- 网格填充 -->
    <div class="mb-10" v-if="background.fillType === 3">
      <el-row>
        <el-col :span="4" class="slider-name">强度：</el-col>
        <el-col :span="16">
          <el-slider class="common-slider" :min="0" :max="1" :step="0.01" v-model="gridStrengthRef" @change="changeGridStrength"/>
        </el-col>
        <el-col :span="4" class="slider-num">{{ gridStrengthRef }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="slider-name">方差：</el-col>
        <el-col :span="16">
          <el-slider class="common-slider" :min="0" :max="1" :step="0.01" v-model="gridVarianceRef" @change="changeGridVariance"/>
        </el-col>
        <el-col :span="4" class="slider-num">{{ gridVarianceRef }}</el-col>
      </el-row>
      <el-row class="mb-10">
        <el-col :span="4" class="slider-name">尺寸：</el-col>
        <el-col :span="16">
          <el-slider class="common-slider" :min="0.1" :max="0.25" :step="0.01" v-model="gridSizeRef" @change="changeGridSize"/>
        </el-col>
        <el-col :span="4" class="slider-num">{{ gridSizeRef }}</el-col>
      </el-row>
      <el-row class="mb-10">
        <el-button class="full-row" @click="generateGridBackgroundRandom">随机生成</el-button>
      </el-row>
      <el-row class="mb-10">
        <el-radio-group class="full-ratio" v-model="isGridLibData">
          <el-radio-button :label="true">色彩选择</el-radio-button>
          <el-radio-button :label="false">自定义</el-radio-button>
        </el-radio-group>
      </el-row>
      <el-row>
        <el-button class="full-row" v-if="isGridLibData" @click="generateGridBackgroundRandColor">
          <IconShuffleOne />
        </el-button>
        <el-button class="full-row" v-else @click="showGridColorSelf">
          <IconPlus/>
        </el-button>
      </el-row>
      <div class="mt-10" v-if="isGridLibData">
        <div class="row color-contianer" v-for="(item, index) in GridColorLibs" :key="index">
          <div v-for="color in item.color" :key="color" class="color-box" :style="{backgroundColor: color}" @click="changeGridColor(item.color)"></div>
        </div>
      </div>
      <div class="mt-10" v-else>
        <div :class="[item.length > 0 ? 'row' : '', 'color-contianer']" v-for="(item, index) in gridColorRecent" :key="index">
          <div v-for="color in item" :key="color" class="color-box" :style="{backgroundColor: color}" @click="changeGridColor(item)"></div>
        </div>
      </div>
    </div>

    <!-- 底纹填充 -->
    <div class="mb-10" v-if="background.fillType === 4">
      <el-row>
        <el-col :span="7" class="slider-name">图形缩放：</el-col>
        <el-col :span="13">
          <el-slider class="common-slider" :min="1" :max="shadingColorLib.maxScale" :step="1" v-model="shadingBackground.scale" @change="changeShadingZoom"/>
        </el-col>
        <el-col :span="4" class="slider-num">{{ shadingBackground.colorCounts }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="7" class="slider-name">水平位置：</el-col>
        <el-col :span="13">
          <el-slider class="common-slider" :min="0" :max="shadingColorLib.width * 2" :step="1" v-model="shadingBackground.moveLeft" @change="changeShadingHorizontal"/>
        </el-col>
        <el-col :span="4" class="slider-num">{{ shadingBackground.moveLeft }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="7" class="slider-name">垂直位置：</el-col>
        <el-col :span="13">
          <el-slider class="common-slider" :min="0" :max="shadingColorLib.height" :step="1" v-model="shadingBackground.moveTop" @change="changeShadingVertical"/>
        </el-col>
        <el-col :span="4" class="slider-num">{{ shadingBackground.moveTop }}</el-col>
      </el-row>

      <el-row v-if="shadingColorLib.mode === 'stroke-join' || shadingColorLib.mode === 'stroke'">
        <el-col :span="7" class="slider-name">线条粗细：</el-col>
        <el-col :span="13">
          <el-slider class="common-slider" :min="0.5" :max="shadingColorLib.maxStroke" :step="0.5" v-model="shadingBackground.stroke" @change="changeShadingStroke"/>
        </el-col>
        <el-col :span="4" class="slider-num">{{ shadingBackground.stroke }}</el-col>
      </el-row>

      <el-row v-if="shadingColorLib.maxSpacing[0] > 0">
        <el-col :span="7" class="slider-name">垂直间距：</el-col>
        <el-col :span="13">
          <el-slider class="common-slider" :min="0" :max="shadingColorLib.maxSpacing[0]" :step="0.5" v-model="shadingBackground.spacing[0]" @change="changeShadingHSpacing"/>
        </el-col>
        <el-col :span="4" class="slider-num">{{ shadingBackground.spacing[0] }}</el-col>
      </el-row>

      <el-row v-if="shadingColorLib.maxSpacing[1] > 0">
        <el-col :span="7" class="slider-name">水平间距：</el-col>
        <el-col :span="13">
          <el-slider class="common-slider" :min="0" :max="shadingColorLib.maxSpacing[1]" :step="0.5" v-model="shadingBackground.spacing[1]" @change="changeShadingVSpacing"/>
        </el-col>
        <el-col :span="4" class="slider-num">{{ shadingBackground.spacing[1] }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="7" class="slider-name">旋转角度：</el-col>
        <el-col :span="13">
          <el-slider class="common-slider" :min="0" :max="180" :step="1" v-model="shadingBackground.angle" @change="changeShadingAngle"/>
        </el-col>
        <el-col :span="4" class="slider-num">{{ shadingBackground.angle }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="7" class="slider-name">颜色数量：</el-col>
        <el-col :span="13">
          <el-slider class="common-slider" :min="2" :max="shadingColorLib.colors" :step="1" v-model="shadingBackground.colorCounts" @change="changeShadingColors"/>
        </el-col>
        <el-col :span="4" class="slider-num">{{ shadingBackground.colorCounts }}</el-col>
      </el-row>
      <div class="row">
        <div 
          v-for="(color, index) in shadingBackground.colors" 
          :key="index" 
          :class="index + 1 <= shadingBackground.colorCounts ? 'color-item' : 'color-non'" 
          :style="{ backgroundColor: color }"
          >
          <el-popover trigger="click" placement="bottom" :width="265">
            <template #reference>
              <div class="color-select"></div>
            </template>
            <ColorPicker :modelValue="color"/>
          </el-popover>
        </div>
      </div>
      <div class="background-shading-body">
        <div 
          v-for="item in shadingColorLibs" 
          :key="item.title" 
          class="shading-box" 
          :style="{ backgroundImage: `url(&quot;${shadingSvgPattern(item.width, item.height, item.path, item.mode)}&quot;)` }"
          @click="changeShadingElement(item)"
          >
        </div>
      </div>
    </div>
    <GridFill v-model:visible="gridColorDialog" @close="hideGridColorSelf" @save="saveGridColorSelf"></GridFill>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useMainStore, useTemplatesStore } from '@/store'
import { storeToRefs } from 'pinia'
import { debounce } from 'lodash'
import { Gradient, Pattern, util } from 'fabric'
import { TransparentFill, BackgroundFillMode, BackgroundFillImageMode, BackgroundFillGridMode, BackgroundFillGradientMode } from '@/configs/background'
import { GridColorLibs } from '@/configs/colorGrid'
import { GradientColorLibs } from '@/configs/colorGradient'
import { ShadingColorLibInit, ShadingLigntColors, ShadingBackgroudInit } from '@/configs/colorShading'
import { GradientCoords } from '@/types/elements'
import { ShadingColorLib, ShadingBackground } from '@/types/elements'
import { BackgroundElement, CanvasElement, TextboxElement } from '@/types/canvas'
import { getRandomNum } from '@/utils/common'
import { getImageDataURL } from '@/utils/image'
import { getColorShading } from '@/api/color'
import trianglify from '@/plugins/trianglify/trianglify'
import useCanvas from '@/views/Canvas/useCanvas'
import GridFill from './GridFill.vue'
import GradientFill from './GradientFill.vue'

const mainStore = useMainStore()
const templatesStore = useTemplatesStore()
const { canvasObject } = storeToRefs(mainStore)


// 渐变偏移
const gradientOpacity = ref(1)
const gradientRotate = ref(0)
const gradientOffsetX = ref(0)
const gradientOffsetY = ref(0)

// 网格 预定义 参数
const RECENT_GRIDS = 'RECENT_GRIDS'
const gridColorRecent = ref<[string[]]>([[]])
const isGridLibData = ref(true)
const gridColorMode = ref<'interpolateLinear' | 'sparkle' | 'shadows'>('sparkle')
const gridSizeRef = ref(0.15)
const gridColorsRef = ref<string[]>(GridColorLibs[0].color)
const gridStrengthRef = ref(0.5)
const gridVarianceRef = ref(0.5)
const gridColorDialog = ref(false)

const shadingColorLibs = ref<ShadingColorLib[]>([])
const shadingColorLib = ref<ShadingColorLib>(ShadingColorLibInit)  // 底纹 预定义 参数
const shadingBackground = ref<ShadingBackground>(ShadingBackgroudInit)

// 加载缓存最近添加的网格 
onMounted(async () => {
  const recentGridCache = localStorage.getItem(RECENT_GRIDS)
  if (recentGridCache) gridColorRecent.value = JSON.parse(recentGridCache)
  const res = await getColorShading()
  shadingColorLibs.value = res.data
  shadingColorLib.value = shadingColorLibs.value[0]
})

// 保存缓存最近添加的网格 
watch(gridColorRecent, () => {
  const recentGridCache = JSON.stringify(gridColorRecent.value)
  localStorage.setItem(RECENT_GRIDS, recentGridCache)
}, {deep: true})
const handleElement = computed(() => canvasObject.value as CanvasElement)

const background = computed(() => {
  if (!handleElement.value) {
    return {
      fillType: 0,
      fill: '#fff',
    } as BackgroundElement
  }
  if (!handleElement.value.background) {
    return {
      fillType: 0,
      fill: handleElement.value.fill,
      color: (handleElement.value as TextboxElement).color
    } as BackgroundElement
  }
  return handleElement.value.background
})

// 设置背景图片隐藏
const removeBackgroundElement = () => {
  const [ canvas ] = useCanvas()
  canvas.set('backgroundImage', null)
  canvas.renderAll()
}

// 设置背景模式：纯色，图片，渐变，网格，形状，智能
const changeBackgroundType = (type: number) => {
  // 纯色
  if (type === 0) {
    const elementBackground: BackgroundElement = {
      ...background.value,
      fillType: type,
      fill: background.value.color || '#fff',
    }
    updateBackground(elementBackground)
  }
  // 图片
  else if (type === 1) {
    const elementBackground: BackgroundElement = {
      ...background.value,
      fillType: type,
      fill: background.value.fill,
      imageURL: background.value.imageURL || '',
      imageSize: background.value.imageSize || 'cover',
    }
    updateBackground(elementBackground)
    generateImageBackground()
  }
  // 网格
  else if (type === 3) {
    const elementBackground: BackgroundElement = {
      ...background.value,
      fillType: type,
      fill: background.value.fill,
      gaidImageURL: background.value.gaidImageURL || '',
    }
    updateBackground(elementBackground)
    generateGridBackground()
  }
  // 底纹
  else if (type === 4) {
    const elementBackground: BackgroundElement = {
      ...background.value,
      fillType: type,
      backgroundColor: TransparentFill,
      shadingImageURL: background.value.shadingImageURL || '',
    }
    removeBackgroundElement()
    updateBackground(elementBackground)
    generateShadingBackground()
  }
  // 渐变
  else {
    const elementBackground: BackgroundElement = {
      ...background.value,
      fillType: 2,
      gradientType: background.value.gradientType || 'linear',
      gradientColor: background.value.gradientColor || GradientColorLibs[0].colors,
      gradientName: background.value.gradientName || GradientColorLibs[0].name
    }
    updateBackground(elementBackground)
    generateGradientBackground()
  }
}


// 设置背景
const updateBackground = (props: Partial<BackgroundElement>) => {
  const [ canvas ] = useCanvas()
  if (!canvasObject.value) return
  const color = props.color ? props.color : (handleElement.value as TextboxElement).color
  canvasObject.value.set({fill: props.fill, color, fillType: background.value.fillType, background: {...background.value, ...props}})
  canvas.renderAll()
  templatesStore.modifedElement()
}

// 修改上传背景
const generateImageBackground = async () => {
  const imageURL = background.value.imageURL
  if (!imageURL) return
  if (background.value.imageSize === 'repeat') {
    const source = await util.loadImage(imageURL)
    const elementPattern = new Pattern({source, repeat: 'repeat'})
    updateBackground({ fill: elementPattern, imageURL})
  } 
  else {
    const source = await util.loadImage(imageURL)
    // const { width, height } = await getImageSize(imageURL)
    if (!handleElement.value) return
    // source.width = handleElement.value.width
    // source.height = handleElement.value.height
    // source.style.width = handleElement.value.width + 'px'
    // source.style.height = handleElement.value.height + 'px'
    // source.style.transform = 'scale(0.1)'
    const elementPattern = new Pattern({source, repeat: 'no-repeat'})
    updateBackground({ fill: elementPattern, imageURL })
  }
}

// 上传背景图片
const uploadBackgroundImage = async (files: FileList) => {
  const imageFile = files[0]
  if (!imageFile) return
  background.value.imageURL = await getImageDataURL(imageFile)
  generateImageBackground()
}

// 修改背景图片
const changeImageSize = () => {
  generateImageBackground()
}

// 修改渐变名字
const changeGradientName = (gradientName: string) => {
  const gradientColorLib = GradientColorLibs.filter(item => item.name === gradientName)[0]
  if (gradientColorLib) {
    background.value.gradientName = gradientName
    updateBackground({gradientColor: gradientColorLib.colors})
    generateGradientBackground()
  } 
}

// 修改渐变类型
const changeGradientType = () => {
  updateBackground({gradientType: background.value.gradientType})
  generateGradientBackground()
}

// 修改渐变颜色
const updateGradientBackground = (index: number, color: string) => {
  const gradientBackgroundColor = background.value.gradientColor
  if (gradientBackgroundColor) {
    gradientBackgroundColor[index].color = color
    updateBackground({ gradientColor: gradientBackgroundColor })
    generateGradientBackground()
  }
}

// 生成渐变背景
const generateGradientBackground = () => {
  if (!handleElement.value) return
  const width = handleElement.value.width
  const height = handleElement.value.height
  let coords: GradientCoords = { x1: 0, y1: 0, x2: width, y2: 0 }
  if (background.value.gradientType !== 'linear') {
    coords = { r1: 0, r2: height / 2, x1: width / 2, y1: height / 2, x2: width / 2, y2: height / 2 }
  } 
  const rotateCos = Math.cos(gradientRotate.value * Math.PI / 180.0)
  const rotateSin = Math.sin(gradientRotate.value * Math.PI / 180.0)
  const gradient = new Gradient({
    type: background.value.gradientType,
    colorStops: background.value.gradientColor || GradientColorLibs[0].colors,
    coords: coords,
    offsetX: gradientOffsetX.value * width,
    offsetY: gradientOffsetY.value * height,
    gradientTransform: [rotateCos, rotateSin, -1 * rotateSin, rotateCos, 0, 0],
    gradientUnits: 'pixels'
  })
  updateBackground({fill: gradient, opacity: gradientOpacity.value})
}

// 更新缓存保存最大的网格
const updateGridColorRecentCache = debounce(function() {
  const maxLength = 10
  if (gridColorRecent.value.length > maxLength) {
    gridColorRecent.value = gridColorRecent.value.slice(0, maxLength) as [string[]]
  }
}, 300, { trailing: true })

// 修改网格图片强度
const changeGridStrength = (value: number) => {
  gridStrengthRef.value = value
  generateGridBackground()
}
// 修改网格图片方差
const changeGridVariance = (value: number) => {
  gridVarianceRef.value = value
  generateGridBackground()
}
// 修改网格图片尺寸
const changeGridSize = (value: number) => {
  gridSizeRef.value = value
  generateGridBackground()
}

// 随机数字生成网格
const generateGridBackgroundRandom = () => {
  gridStrengthRef.value = Math.floor(getRandomNum(0, 1) * 100) / 100
  gridVarianceRef.value = Math.floor(getRandomNum(0, 1) * 100) / 100
  gridSizeRef.value = Math.floor(getRandomNum(0, 0.25) * 100) / 100
  generateGridBackground()
}

// 随机颜色生成网格
const generateGridBackgroundRandColor = () => {
  generateGridBackground('random')
}

// 显示网格自定义
const showGridColorSelf = () => {
  gridColorDialog.value = true
}
// 隐藏网格自定义
const hideGridColorSelf = () => {
  gridColorDialog.value = false
}

// 保存网格自定义
const saveGridColorSelf = (colors: string[]) => {
  gridColorRecent.value.unshift(colors)
  updateGridColorRecentCache()
}

// 选择网格图片色彩
const changeGridColor = (colors: string[]) => {
  gridColorsRef.value = colors
  generateGridBackground()
}

// 选择网格色彩模式
const changeGridColorMode = (mode: 'interpolateLinear' | 'sparkle' | 'shadows') => {
  gridColorMode.value = mode
  generateGridBackground()
}

// 获取网格图片颜色模式
const getGridColorFunction = () => {
  if (gridColorMode.value === 'interpolateLinear') {
    return trianglify.colorFunctions.interpolateLinear(gridStrengthRef.value)
  }
  else if (gridColorMode.value === 'sparkle') {
    return trianglify.colorFunctions.sparkle(gridStrengthRef.value)
  }
  else if (gridColorMode.value === 'shadows') {
    return trianglify.colorFunctions.shadows(gridStrengthRef.value)
  }
  return trianglify.colorFunctions.sparkle(gridStrengthRef.value)
}

// 生成网格图片
const generateGridBackground = async (status?: string) => {
  if (!handleElement.value) return
  const width = handleElement.value.width, height = handleElement.value.height
  const gridColors = gridColorsRef.value && gridColorsRef.value.length > 0 && status !== 'random' ? gridColorsRef.value : 'random'

  const defaultOptions = {
    width,
    height,
    cellSize: gridSizeRef.value * width,
    variance: gridVarianceRef.value,
    seed: null,
    xColors: gridColors,
    yColors: 'match',
    fill: true,
    palette: trianglify.utils.colorbrewer,
    colorSpace: 'lab',
    colorFunction: getGridColorFunction(),
    strokeWidth: 0,
    points: null
  }
  const trianglifier = trianglify(defaultOptions)
  // @ts-ignore
  const canvasBackground = trianglifier.toCanvas()
  const dataURL = canvasBackground.toDataURL('image/svg')
  const source = await util.loadImage(dataURL)
  const elementPattern = new Pattern({source, repeat: 'repeat'})
  updateBackground({fill: elementPattern, gaidImageURL: dataURL})
}

// 底纹样式读取
const shadingSvgPattern = (width: number, height: number, path: string, mode: string) => {
  let strokeGroup = ''
  for (let i = 0; i < path.split('~').length; i++) {
    const svgColor = ShadingLigntColors[i + 1]
    let strokeFill = `stroke-width='1' stroke='${svgColor}' fill='none'`
    if (mode === 'fill') strokeFill = `stroke='none' fill='${svgColor}'`
    strokeGroup += path.split('~')[i].replace('/>', ` ${strokeFill}/>`)
  }
  const patternData =
      "<svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs>" +
      "<pattern id='a' patternUnits='userSpaceOnUse' width='" +
      width +
      "' height='" +
      height +
      "'><rect x='0' y='0' width='" +
      width +
      "' height='" +
      height +
      "' fill='" +
      ShadingLigntColors[0] +
      "'/>" +
      strokeGroup +
      "</pattern></defs><rect width='100%' height='100%' fill='url(%23a)'/></svg>"
  const svgShading = `data:image/svg+xml,${patternData}`
  return svgShading
}

// 多笔画底纹
const multiStroke = (index: number, vHeight: number, maxColors: number, mode: string, path: string, item: ShadingBackground) => {
  const colors = item.colors
  const colorCounts = item.colorCounts
  const join = item.join
  const spacing = item.spacing
  const stroke = item.stroke
  let defColor = colors[index + 1]
  let strokeFill = '', joinMode = ''
  if (vHeight === 0 && maxColors > 2) {
    if (colorCounts === 3 && maxColors === 4 && index === 2) defColor = colors[1]
    else if (colorCounts === 4 && maxColors === 5 && index === 3) defColor = colors[1]
    else if (colorCounts === 3 && maxColors === 5 && index === 3) defColor = colors[1]
    else if (colorCounts === 3 && maxColors === 5 && index === 2) defColor = colors[1]
    else if (colorCounts === 2) defColor = colors[1]
  }
  if (mode === 'stroke-join') {
    strokeFill = " stroke='" + defColor + "' fill='none'"
    joinMode = join === 2 ? "stroke-linejoin='round' stroke-linecap='round' " : "stroke-linecap='square' "
  } 
  else if (mode === 'stroke') {
    strokeFill = " stroke='" + defColor + "' fill='none'"
  }
  else {
    strokeFill = " stroke='none' fill='" + defColor + "'"
  } 
  return path.split('~')[index].replace('/>', " transform='translate(" + spacing[0] / 2 + ",0)' " + joinMode + "stroke-width='" + stroke + "'" + strokeFill + '/>').replace("transform='translate(0,0)' ", ' ')
}

// 底纹样式背景生成
const generateShadingBackground = async () => {
  if (!handleElement.value || !shadingColorLib.value) return
  const item = shadingColorLib.value
  const maxColors = item.path.split('~').length + 1
  const width = item.width
  const height = item.height
  const vHeight = item.vHeight
  const path = item.path
  const mode = item.mode
  const svgWidth = width + shadingBackground.value.spacing[0]
  const svgHeight = height - vHeight * (maxColors - shadingBackground.value.colorCounts) + shadingBackground.value.spacing[1]
  const imageWidth = handleElement.value.width, imageHeight = handleElement.value.height
  let strokeGroup = ''
  for (let i = 0; i < maxColors - 1; i++) {
    strokeGroup += multiStroke(i, vHeight, maxColors, mode, path, shadingBackground.value)
  }
  const translateX = shadingBackground.value.scale * shadingBackground.value.moveLeft
  const translateY = shadingBackground.value.scale * shadingBackground.value.moveTop
  const svg = `
    <svg id='patternId' width='${imageWidth}' height='${imageHeight}' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <pattern id='a' patternUnits='userSpaceOnUse' 
          width='${svgWidth}' 
          height='${svgHeight}'
          patternTransform='scale(${shadingBackground.value.scale}) rotate(${shadingBackground.value.angle})'
        >
          <rect x='0' y='0' width='100%' height='100%' fill='${shadingBackground.value.colors[0]}'/>
          ${strokeGroup}
        </pattern>
      </defs>
      <rect x="0" y="0" width='${imageWidth}' height='${imageHeight}' transform='translate(${translateX},${translateY})' fill='url(%23a)' />
    </svg>
  `
  const imageURL = `data:image/svg+xml,${svg}`
  const source = await util.loadImage(imageURL)
  const elementPattern = new Pattern({source, repeat: 'no-repeat'})
  updateBackground({ shadingImageURL: imageURL, fill: elementPattern })
}

// // 选择底纹填充
const changeShadingElement = (item: ShadingColorLib) => {
  shadingColorLib.value = item
  shadingBackground.value.colorCounts = item.colors
  generateShadingBackground()
}

// 修改底纹缩放
const changeShadingZoom = (value: number) => {
  shadingBackground.value.scale = value
  generateShadingBackground()
}
// 修改底纹水平位置
const changeShadingHorizontal = (value: number) => {
  shadingBackground.value.moveLeft = value
  generateShadingBackground()
}
// 修改底纹垂直位置
const changeShadingVertical = (value: number) => {
  shadingBackground.value.moveTop = value
  generateShadingBackground()
}
// 修改底纹线条粗细
const changeShadingStroke = (value: number) => {
  shadingBackground.value.stroke = value
  generateShadingBackground()
}
// 修改底纹水平间隔
const changeShadingHSpacing = (value: number) => {
  shadingBackground.value.spacing[0] = value
  generateShadingBackground()
}
// 修改底纹垂直间隔
const changeShadingVSpacing = (value: number) => {
  shadingBackground.value.spacing[1] = value
  generateShadingBackground()
}
// 修改底纹填充旋转角度
const changeShadingAngle = (value: number) => {
  shadingBackground.value.angle = value
  generateShadingBackground()
}
// 修改底纹填充颜色数量
const changeShadingColors = (value: number) => {
  shadingBackground.value.colorCounts = value
  generateShadingBackground()
}
// 随机底纹填充形状
const generateShadingBackgroundRandom = () => {
  const item = shadingColorLibs.value[Math.floor(getRandomNum(0, shadingColorLibs.value.length - 1))]
  shadingColorLib.value = item
  if (item.colors) shadingBackground.value.colorCounts = item.colors
  generateShadingBackground()
}
</script>

<style lang="scss" scoped>
.icon-btn {
  cursor: pointer;
}
.slide-design-panel {
  user-select: none;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.title {
  margin-bottom: 10px;
}

.fixed-ratio {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.slider-name {
  display: flex;
  align-items: center;
}
.slider-num {
  display: flex;
  align-items: center;
  justify-content: center;
}
.mb-10 {
  margin-bottom: 10px;
}
.full-row {
  flex: 1;
  width: 100%;
}

.full-group {
  display: flex;
  flex: 1;
  .el-button {
    width: 50%;
  }
}

.full-ratio {
  display: flex;
  flex: 1;
  .el-radio-button {
    width: 50%;
  }
  .el-radio-button__inner {
    width: 100%
  }
}


.background-image {
  height: 0;
  padding-bottom: 56.25%;
  border: 1px dashed var(--el-border-color);
  border-radius: $borderRadius;
  position: relative;
  transition: all $transitionDelay;

  &:hover {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
  }

  .content {
    @include absolute-0();

    display: flex;
    justify-content: center;
    align-items: center;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
  }
}

.theme-list {
  @include flex-grid-layout();
}
.theme-item {
  @include flex-grid-layout-children(2, 48%);

  padding-bottom: 30%;
  border-radius: $borderRadius;
  position: relative;
  cursor: pointer;

  .theme-item-content {
    @include absolute-0();

    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 8px;
    border: 1px solid $borderColor;
  }

  .text {
    font-size: 16px;
  }
  .colors {
    display: flex;
  }
  .color-block {
    margin-top: 8px;
    width: 12px;
    height: 12px;
    margin-right: 2px;
  }

  &:hover .btns {
    display: flex;
  }

  .btns {
    @include absolute-0();

    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: none;
    background-color: rgba($color: #000, $alpha: .25);
  }
  .btn {
    width: 72px;
    padding: 5px 0;
    text-align: center;
    background-color: $themeColor;
    color: #fff;
    font-size: 12px;
    border-radius: $borderRadius;

    &:hover {
      background-color: #c42f19;
    }

    & + .btn {
      margin-top: 5px;
    }
  }
}
.slider {
  flex: 3;
}
.mt-10 {
  margin-top: 10px;
}
.color-group {
  display: flex;
  flex: 1 1;
}
.color-box {
  flex: 1 1;
  height: 25px;
}
.color-contianer:hover {
  box-shadow: 0 0 20px 2px rgb(0 0 0 / 40%);
  width: calc(100% - 5px) !important;
  cursor: pointer;
}

.config-strength {
  flex: 10;
}

.config-variance {
  flex: 10;
}
.config-size {
  flex: 10;
}
.gradient-box {
  display: flex;
  flex: 1;
  .el-button {
    width: 100%;
  }
}
.background-gradient-body {
  height: 300px;
  overflow: auto;
}
.gradient-content {
  display: flex;
  justify-content: center;
  padding-bottom: 2px;
}
.gradient-content:hover {
  width: calc(100% - 2px) !important;
  border-color: $themeColor;
  cursor: pointer;
}
.background-shading-body {
  height: 500px;
  overflow: auto;
}
.shading-box {
  flex: 1;
  height: 50px;
  margin-bottom: 5px;
  border: 1px solid transparent;
  border-color: #d9d9d9;
  border-radius: 5px;
}
.shading-box:hover {
  // box-shadow: 0 0 20px 2px rgb(0 0 0 / 40%);
  width: calc(100% - 2px) !important;
  cursor: pointer;
  border-color: $themeColor;
}
.color-item {
  height: 42px;
  border: 1px solid transparent;
  border-color: #d9d9d9;
  border-radius: 5px;
  flex: 1;
  display: inline-block;
  cursor: pointer;
  margin: 0 2px;
  transition: transform .2s ease, box-shadow .2s ease;
}

.color-item:hover {
  border-color: $themeColor;
}

.color-non {
  display: none;
}
.color-select {
  width: 100%;
  height: 100%;
}

.common-slider {
  width: 90%;
  margin: 0 auto;
}

</style>

<style scoped>
:deep(.el-input .el-input-group__prepend) {
  padding: 0 5px;
}
:deep(.el-input .el-input-group__append) {
  padding: 0 5px;
}
:deep(.full-ratio .el-radio-button__inner) {
  width: 100%;
}
</style>