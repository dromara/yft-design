<template>
  <div class="text-style-panel">    
    <el-row>
      <el-col :span="12">
        <el-select v-model="elementFontFamily" @change="handleElementFontFamily">
          <el-option-group v-for="group in fontOptionGroups" :key="group.label" :label="group.label">
            <el-option v-for="item in group.options" :key="item" :value="item.value" :label="item.label" :style="{fontFamily: item.value}"></el-option>
          </el-option-group>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-select v-model="handleElement.fontSize" @change="handleElementFontSize">
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
                  <TextColorButton :color="handleElement.fill">
                    <IconText />
                  </TextColorButton>
                </el-button>
              </template>
              <ColorPicker :modelValue="handleElement.fill" @update:modelValue="(color: string) => updateFontColor(color)"/>
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
      <el-col :span="18">
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
        </el-radio-group>
      </el-col>
      <el-col :span="6">
        <el-tooltip placement="top" content="转曲" :hide-after="0">
          <el-button class="full-button" @click="handleElementCurve">
            <IconTextStyleOne />
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
import { computed, ref } from 'vue'
import { useMainStore, useTemplatesStore } from '@/store'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { FontSizeLibs, LineHeightLibs, CharSpaceLibs } from '@/configs/texts'
import { WEB_FONTS } from '@/configs/fonts'
import { TextboxElement } from '@/types/canvas'
import { FontGroupOption } from '@/types/elements'
import useCreateElement from "@/hooks/useCreateElement"
import * as localFonts from '@/utils/localFonts'
import opentype from "opentype.js";
import ElementStroke from '../Components/ElementStroke.vue'
import ElementShadow from '../Components/ElementShadow.vue'
import ElementOpacity from '../Components/ElementOpacity.vue'
import ElementPatterns from '../Components/ElementPatterns.vue'
import ElementFill from '../Backgrounds/ElementFill.vue'
import useCanvas from '@/views/Canvas/useCanvas'


const mainStore = useMainStore()
const templatesStore = useTemplatesStore()
const { canvasObject, systemFonts } = storeToRefs(mainStore)
const { createPathElement } = useCreateElement()
const { loadFontData } = localFonts
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
  handleElement.value.set({fontFamily})
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改字体大小
const handleElementFontSize = (fontSize: number) => {
  handleElement.value.set({fontSize})
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改字体颜色
const updateFontColor = (fill: string) => {
  handleElement.value.set({fill})
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改背景颜色
const updateBackgroundColor = (backgroundColor: string) => {
  handleElement.value.set({backgroundColor})
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改字体大小
const handleElementFontsize = (mode: string) => {
  if (!handleElement.value.fontSize) {
    handleElement.value.set({fontSize: 36})
  }
  const fontSizeNum = mode === '+' ? handleElement.value.fontSize + 1 : handleElement.value.fontSize - 1
  handleElement.value.set({fontSize: fontSizeNum})
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改字体加粗
const handleElementBlod = () => {
  const fontBold = 'bold', fontNormal = 'normal'
  if (handleElement.value.isEditing) {
    console.log('handleElement.value:', handleElement.value)
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
  handleElement.value.set({fontStyle})
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改删除线
const handleElementLinethrough = () => {
  handleElement.value.set({linethrough: !handleElement.value.linethrough})
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改中划线
const handleElementUnderline = () => {
  handleElement.value.set({underline: !handleElement.value.underline})
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改字体居中
const handleTextAlign = (textAlign: string) => {
  handleElement.value.set({textAlign})
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
    fontElement = await opentype.load(`/src/assets/fonts/${hasFontFamily.value}.ttf`)
  } else {
    const fontData = await loadFontData(hasFontFamily.value)
    if (!fontData) return
    const fontBlob = await fontData.blob()
    const fontBuffer = await fontBlob.arrayBuffer()
    fontElement = opentype.parse(fontBuffer)
  }
  if (!fontElement) return
  const path = fontElement.getPath(handleElement.value.text, 0, 0, handleElement.value.fontSize).toPathData(2);
  createPathElement(path, handleElement.value.left, handleElement.value.top)
  canvas.remove(handleElement.value)
  canvas.renderAll()
}

const handleElementStyleClear = () => {
  handleElement.value.cleanStyle('fontWeight')
  templatesStore.modifedElement()
  canvas.renderAll()
}
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