<template>
  <div class="text-style-panel">
    <ElementPosition/>
    <el-divider />
    <el-row>
      <el-col :span="12">
        <el-select v-model="elementFontFamily" placement="left" @change="handleElementFontFamily">
          <el-option-group v-for="group in fontOptionGroups" :key="group.label" :label="group.label">
            <el-option v-for="item in group.options" :key="item" :value="item.value" :label="item.label" :style="{fontFamily: item.value}"></el-option>
          </el-option-group>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-select class="fontsize" filterable allow-create default-first-option v-model="handleElement.fontSize" placement="left" @change="handleElementFontSize">
          <el-option v-for="item in FontSizeLibs" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
    </el-row> 
    
    <el-row class="mt-10">
      <el-col :span="6">
        <el-tooltip placement="top" content="文字颜色" :hide-after="0" >
          <div @click.stop class="tooltip-popover">
            <el-popover trigger="click" placement="bottom" :width="265" @click.stop>
              <template #reference>
                <el-button class="font-color">
                  <TextColorButton :color="handleElement.color">
                    <IconText />
                  </TextColorButton>
                </el-button>
              </template>
              <ColorPicker :modelValue="handleElement.color" @update:modelValue="(color: string) => updateFontColor(color)"/>
            </el-popover>
          </div>
        </el-tooltip>
      </el-col>
      <el-col :span="6">
        <el-tooltip placement="top" content="文字高亮" :hide-after="0">
          <div @click.stop class="tooltip-popover">
            <el-popover trigger="click" placement="bottom" :width="265">
              <template #reference>
                <el-button class="high-light">
                  <TextColorButton :color="handleElement.backgroundColor">
                    <IconHighLight />
                  </TextColorButton>
                </el-button>
              </template>
              <ColorPicker :modelValue="handleElement.backgroundColor" @update:modelValue="(color: string) => updateBackgroundColor(color)"/>
            </el-popover>
          </div>
        </el-tooltip>
      </el-col>
      <el-col :span="12">
        <el-button-group class="full-group">
          <el-tooltip placement="top" content="增大字号" :hide-after="0">
            <el-button class="font-size" @click="handleElementFontsize('+')">
              <IconFontSize />+
            </el-button>
          </el-tooltip>

          <el-tooltip placement="top" content="减小字号" :hide-after="0">
            <el-button @click="handleElementFontsize('-')">
              <IconFontSize />-
            </el-button>
          </el-tooltip>
        </el-button-group>
      </el-col>
    </el-row>

    <el-row class="mt-10">
      <div class="full-checkbox">
        <el-tooltip placement="top" content="加粗" :hide-after="0">
          <el-checkbox-button :label="hasFontWeight" @change="handleElementBlod()">
            <IconTextBold />
          </el-checkbox-button>
        </el-tooltip>
        <el-tooltip placement="top" content="斜体" :hide-after="0">
          <el-checkbox-button v-model="hasFontStyle" @change="handleElementItalic()">
            <IconTextItalic />
          </el-checkbox-button>
        </el-tooltip>
        <el-tooltip placement="top" content="下划线" :hide-after="0">
          <el-checkbox-button v-model="hasUnderline" @change="handleElementUnderline()">
            <IconTextUnderline />
          </el-checkbox-button>
        </el-tooltip>
        <el-tooltip placement="top" content="删除线" :hide-after="0">
          <el-checkbox-button v-model="hasLinethrough" @change="handleElementLinethrough()">
            <IconStrikethrough />
          </el-checkbox-button>
        </el-tooltip>
      </div>
    </el-row>

    <el-row class="mt-10">
      <el-button-group class="full-group">
        <el-tooltip placement="top" content="横向" :hide-after="0">
          <el-button @click="handleElementArrange(false)" :type="!elementGrapheme ? 'primary': ''">
            <IconTextRotationNone />
          </el-button>
        </el-tooltip>
        <el-tooltip placement="top" content="纵向" :hide-after="0">
          <el-button @click="handleElementArrange(true)" :type="elementGrapheme ? 'primary': ''">
            <IconTextRotationDown />
          </el-button>
        </el-tooltip>
        <el-tooltip placement="top" content="减小缩进" :hide-after="0">
          <el-button @click="handleElementCharSpacing('-')">
            <IconIndentLeft />
          </el-button>
        </el-tooltip>
        <el-tooltip placement="top" content="增大缩进" :hide-after="0">
          <el-button @click="handleElementCharSpacing('+')">
            <IconIndentRight />
          </el-button>
        </el-tooltip>
      </el-button-group>
    </el-row>

    <el-row class="mt-10">
      <el-col :span="24">
        <el-radio-group class="full-ratio" v-model="textAlign" @change="handleTextAlign">
          <el-tooltip placement="top" content="左对齐" :hide-after="0">
            <el-radio-button label="justify-left">
              <IconAlignTextLeft />
            </el-radio-button>
          </el-tooltip>
          <el-tooltip placement="top" content="居中" :hide-after="0">
            <el-radio-button label="justify-center">
              <IconAlignTextCenter />
            </el-radio-button>
          </el-tooltip>
          <el-tooltip placement="top" content="右对齐" :hide-after="0">
            <el-radio-button label="justify-right">
              <IconAlignTextRight />
            </el-radio-button>
          </el-tooltip>
          <el-tooltip placement="top" content="两边对齐" :hide-after="0">
            <el-radio-button label="justify-right">
              <IconAlignTextBoth />
            </el-radio-button>
          </el-tooltip>
        </el-radio-group>
      </el-col>
    </el-row>

    <el-row class="mt-10">
      <el-col :span="12">
        <el-tooltip placement="top" content="转曲" :hide-after="0">
          <el-button class="full-button" @click="handleElementCurve">
            <IconTextStyleOne />
          </el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="12">
        <el-tooltip placement="top" content="变形" :hide-after="0">
          <el-button class="full-button" @click="handleElementDeformation">
            <IconDistortion />
          </el-button>
        </el-tooltip>
      </el-col>
    </el-row>

    <el-divider />
    <ElementFill />
    <el-divider />

    <div class="row">
      <div style="flex: 2;">行距：</div>
      <el-select style="flex: 3" suffix-icon="IconRowHeight" v-model="handleElement.lineHeight">
        <el-option v-for="item in LineHeightLibs" :key="item" :value="item" :label="item"></el-option>
      </el-select>
      <div style="flex: 1;"></div>
      <div style="flex: 2;">字距：</div>
      <el-select style="flex: 3" suffix-icon="IconFullwidth" v-model="handleElement.charSpacing">
        <el-option v-for="item in CharSpaceLibs" :key="item" :value="item" :label="item"></el-option>
      </el-select>
    </div>

    <el-divider />
    <ElementStroke />
    <el-divider />
    <ElementShadow />
    <el-divider />
    <ElementPatterns />
    <el-divider />
    <ElementOpacity />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore, useTemplatesStore } from '@/store'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { FontSizeLibs, LineHeightLibs, CharSpaceLibs } from '@/configs/texts'
import { WEB_FONTS } from '@/configs/fonts'
import { propertiesToInclude } from '@/configs/canvas'
import { TextboxElement } from '@/types/canvas'
import { FontGroupOption } from '@/types/elements'
import { loadFont } from '@/utils/fonts'
import { Path, classRegistry, Text } from 'fabric'
import opentype from "opentype.js"
import ElementPosition from '../Components/ElementPosition.vue'
import ElementStroke from '../Components/ElementStroke.vue'
import ElementShadow from '../Components/ElementShadow.vue'
import ElementOpacity from '../Components/ElementOpacity.vue'
import ElementPatterns from '../Components/ElementPatterns.vue'
import ElementFill from '../Backgrounds/ElementFill.vue'
import useHandleCreate from "@/hooks/useHandleCreate"
import useCanvas from '@/views/Canvas/useCanvas'



const mainStore = useMainStore()
const templatesStore = useTemplatesStore()
const { canvasObject, systemFonts } = storeToRefs(mainStore)
const { createPathElement } = useHandleCreate()
const [ canvas ] = useCanvas()
const handleElement = computed(() => canvasObject.value as TextboxElement)
const elementGrapheme = computed(() => handleElement.value.splitByGrapheme)
const hasFontFamily = computed(() => handleElement.value.fontFamily)
const hasFontWeight = computed(() => handleElement.value.fontWeight !== 'normal')
const hasFontStyle = computed(() => handleElement.value.fontStyle !== 'normal')
const hasUnderline = computed(() => handleElement.value.underline)
const hasLinethrough = computed(() => handleElement.value.linethrough)
const textAlign = computed(() => handleElement.value.textAlign)
const elementFontFamily = ref<string>(hasFontFamily.value)
const fontSizeRef = ref<Element>()
const fontOptionGroups = ref<FontGroupOption[]>([
  {
    label: '系统字体',
    options: systemFonts.value
  },
  {
    label: '在线字体',
    options: WEB_FONTS
  }
])

// 修改字体族
const handleElementFontFamily = (fontFamily: string) => {
  if (handleElement.value.isEditing) {
    handleElement.value.setSelectionStyles({fontFamily})
  }
  else {
    handleElement.value.set({fontFamily})
  }
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改字体大小
const handleElementFontSize = (fontSize: number) => {
  
  if (handleElement.value.isEditing) {
    handleElement.value.setSelectionStyles({fontSize})
  }
  else {
    handleElement.value.set({fontSize})
  }
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改字体颜色
const updateFontColor = (fill: string) => {
  
  if (handleElement.value.isEditing) {
    handleElement.value.setSelectionStyles({fill})
  }
  else {
    handleElement.value.set({fill, color: fill})
  }
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改背景颜色
const updateBackgroundColor = (backgroundColor: string) => {
  
  if (handleElement.value.isEditing) {
    handleElement.value.setSelectionStyles({backgroundColor})
  }
  else {
    handleElement.value.set({backgroundColor})
  }
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改字体大小
const handleElementFontsize = (mode: string) => {
  if (handleElement.value.fontSize <= 6) return
  const fontSize = mode === '+' ? handleElement.value.fontSize + 1 : handleElement.value.fontSize - 1
  if (handleElement.value.isEditing) {
    handleElement.value.setSelectionStyles({fontSize})
  }
  else {
    handleElement.value.set({fontSize})
  }
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改字体加粗
const handleElementBlod = () => {
  const fontBold = 'bold', fontNormal = 'normal'
  if (handleElement.value.isEditing) {
    console.log('handleElement.value:', handleElement.value.styles)
    const blodState = handleElement.value.getSelectionStyles().find(item => item.fontWeight !== fontBold)
    if (!blodState || (JSON.stringify(blodState) === '{}' && handleElement.value.fontWeight === fontBold)) {
      handleElement.value.setSelectionStyles({'fontWeight': fontNormal})
    } 
    else {
      handleElement.value.setSelectionStyles({'fontWeight': fontBold})
    }
  }
  else {
    const elementStyle = handleElement.value.styles
    if (handleElement.value.fontWeight === fontBold) {
      handleElement.value.set({fontWeight: fontNormal})
      for (let i in elementStyle) {
        for (let j in elementStyle[i]) {
          (elementStyle[i][j] as TextboxElement).set({fontWeight: fontNormal})
        }
      }
    }
    else {
      handleElement.value.set({fontWeight: fontBold})
      for (let i in elementStyle) {
        for (let j in elementStyle[i]) {
          (elementStyle[i][j] as TextboxElement).set({fontWeight: fontBold})
          // elementStyle[i][j].fontWeight = fontBold
        }
      }
    }
  }
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改斜体
const handleElementItalic = () => {
  const fontStyle = handleElement.value.fontStyle === 'italic' ? 'normal': 'italic'

  if (handleElement.value.isEditing) {
    handleElement.value.setSelectionStyles({fontStyle})
  }
  else {
    handleElement.value.set({fontStyle})
  }
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改删除线
const handleElementLinethrough = () => {
  if (handleElement.value.isEditing) {
    handleElement.value.setSelectionStyles({linethrough: !handleElement.value.linethrough})
  }
  else {
    handleElement.value.set({linethrough: !handleElement.value.linethrough})
  }
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改中划线
const handleElementUnderline = () => {
  if (handleElement.value.isEditing) {
    handleElement.value.setSelectionStyles({underline: !handleElement.value.underline})
  }
  else {
    handleElement.value.set({underline: !handleElement.value.underline})
  }
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改字体居中
const handleTextAlign = (textAlign: string) => {
  if (handleElement.value.isEditing) {
    handleElement.value.setSelectionStyles({textAlign})
  }
  else {
    handleElement.value.set({textAlign})
  }
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改缩进
const handleElementCharSpacing = (mode: '+' | '-') => {
  const handleCharSpacing = handleElement.value.charSpacing
  if (!handleCharSpacing) {
    handleElement.value.set({charSpacing: 3})
  }
  const charSpacing = mode === '+' ? handleCharSpacing + 10 : handleCharSpacing - 10
  handleElement.value.set({ charSpacing })
  templatesStore.modifedElement()
  canvas.renderAll()
}

const handleElementArrange = (status: boolean) => {
  handleElement.value.set({splitByGrapheme: status, width: handleElement.value.fontSize})
  templatesStore.modifedElement()
  canvas.renderAll()
}

const handleElementCurve = async () => {
  // ElMessage
  let fontElement: opentype.Font | undefined
  if (WEB_FONTS.filter(item => item.value === hasFontFamily.value)[0]) {
    const fontURL = import.meta.env.MODE === 'production' ? `/assets/${hasFontFamily.value}.ttf` : `/src/assets/fonts/${hasFontFamily.value}.ttf`
    fontElement = await opentype.load(fontURL)
  } else {
    const fontData = await loadFont(hasFontFamily.value)
    if (!fontData) return
    const fontBlob = await fontData.blob()
    const fontBuffer = await fontBlob.arrayBuffer()
    fontElement = opentype.parse(fontBuffer)
  }
  if (!fontElement) return
  const path = fontElement.getPath(handleElement.value.text, 0, 0, handleElement.value.fontSize);
  createPathElement(path.toPathData(2), handleElement.value.left, handleElement.value.top)
  canvas.remove(handleElement.value)
  canvas.renderAll()
}

const handleElementDeformation = () => {
  // const textWidth = handleElement.value.width
  // const quarterWidth = textWidth / 4
  /*
  A(rx, ry, xr, laf, sf, x, y) - 绘制弧线
  rx - (radius-x)：弧线所在椭圆的 x 半轴长
  ry - (radius-y)：弧线所在椭圆的 y 半轴长
  xr - (xAxis-rotation)：弧线所在椭圆的长轴角度
  laf - (large-arc-flag)：是否选择弧长较长的那一段弧
  sf - (sweep-flag)：是否选择逆时针方向的那一段弧
  x, y：弧的终点位置
  */
  // const pathItem = `M 0 0 A ${quarterWidth + 200} ${quarterWidth} 0 0 1 ${textWidth} 0`
  // console.log('pathItem:', pathItem)
  // const pathElement = new Path(pathItem, {
  //   visible: false,
  //   opacity: 1,
  //   originX: 'left',
  //   originY: 'top',
  //   fill: '',
  //   stroke: '#ff5e17',
  //   strokeWidth: 1
  // })
  // handleElement.value.set({path: pathElement, height: handleElement.value.height + 200})
  // const textPath = new Text('Text on a path', {
  //     top: 150,
  //     left: 150,
  //     textAlign: 'center',
  //     charSpacing: -50,
  //     path: new Path('M 0 0 C 50 -100 150 -100 200 0', {
  //       strokeWidth: 1,
  //       visible: false
  //     }),
  //     pathSide: 'left',
  //     pathStartOffset: 0
  // });
  const CurvedText = classRegistry.getClass('CurvedText')
  const options = handleElement.value.toObject(propertiesToInclude) as any
  delete options.type
  const curvedText = new CurvedText(handleElement.value.text, options)
  canvas.add(curvedText)
  templatesStore.modifedElement()
  canvas.renderAll()
}

const handleElementStyleClear = () => {
  handleElement.value.cleanStyle('fontWeight')
  templatesStore.modifedElement()
  canvas.renderAll()
}

onMounted(() => {
  const fontsizeSelect = document.querySelector('.fontsize input')
  if (!fontsizeSelect) return
  fontsizeSelect.addEventListener('input', (val: any) => {
    val.target.value = val.target.value.replace(/[^\d]/g,'')
  })
})
</script>

<style lang="scss" scoped>
.text-style-panel {
  user-select: none;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.preset-style {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.preset-style-item {
  width: 50%;
  height: 50px;
  border: solid 1px #d6d6d6;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: all $transitionDelay;

  &:hover {
    border-color: $themeColor;
    color: $themeColor;
    z-index: 1;
  }

  &:nth-child(2n) {
    margin-left: -1px;
  }
  &:nth-child(n+3) {
    margin-top: -1px;
  }
}
.font-size-btn {
  padding: 0;
}
.link-popover {
  width: 240px;
  .btns {
    margin-top: 10px;
    text-align: right;
  }
}
.mt-10 {
  margin-top: 10px;
}
.full-group {
  display: flex;
  flex: 1;
  .el-button {
    width: 50%;
  }
}

.tooltip-popover {
  .el-button {
    width: 100%;
    border-radius: 0;
  }
  .font-color {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-right: 0;
  }
  .high-light {
    border-right: 0;
  }
}
.font-size {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.full-ratio {
  display: flex;
  flex: 1;
  .el-radio-button {
    position: relative;
    display: inline-flex;
    outline: 0;
    flex: 1;
  }
  .el-radio-button__inner {
    width: 100%
  }
}

.full-checkbox {
  display: flex;
  flex: 1;
}
.full-button {
  width: 100%;
}

</style>

<style scoped>
:deep(.full-ratio .el-radio-button__inner) {
  width: 100%;
}

:deep(.full-ratio .el-radio-button) {
  position: relative;
  display: inline-flex;
  outline: 0;
  flex: 1;
}
:deep(.full-checkbox .el-checkbox-button) {
  position: relative;
  display: inline-flex;
  outline: 0;
  flex: 1;
}

:deep(.full-checkbox .el-checkbox-button__inner) {
  width: 100%;
}
</style>