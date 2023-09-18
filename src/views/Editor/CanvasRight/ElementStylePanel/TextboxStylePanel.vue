<template>
  <div class="text-style-panel">    
    <el-row>
      <el-col :span="12">
        <el-select v-model="handleElement.fontFamily" @change="handleElementFontFamily">
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
              <ColorPicker :modelValue="handleElement.color" @update:modelValue="color => updateFontColor(color)"/>
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
              <ColorPicker :modelValue="handleElement.backgroundColor" @update:modelValue="color => updateBackgroundColor(color)"/>
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
          <el-checkbox-button v-model="handleElement.underline" @change="handleElementLinethrough()">
            <IconTextUnderline />
          </el-checkbox-button>
        </el-tooltip>
        <el-tooltip placement="top" content="删除线" :hide-after="0">
          <el-checkbox-button v-model="handleElement.linethrough" @change="handleElementUnderline()">
            <IconStrikethrough />
          </el-checkbox-button>
        </el-tooltip>
      </div>
    </el-row>

    <el-row class="mt-10">
      <el-button-group class="full-group">
        <el-tooltip placement="top" content="横向" :hide-after="0">
          <el-button @click="handleElementStyleClear">
            <IconTextRotationNone />
          </el-button>
        </el-tooltip>
        <el-tooltip placement="top" content="纵向" :hide-after="0">
          <el-button>
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
      <el-radio-group class="full-ratio" v-model="handleElement.textAlign" @change="handleTextAlign">
        <el-tooltip placement="top" content="左对齐" :hide-after="0">
          <el-radio-button label="left">
            <IconAlignTextLeft />
          </el-radio-button>
        </el-tooltip>
        <el-tooltip placement="top" content="居中" :hide-after="0">
          <el-radio-button label="center">
            <IconAlignTextCenter />
          </el-radio-button>
        </el-tooltip>
        <el-tooltip placement="top" content="右对齐" :hide-after="0">
          <el-radio-button label="right">
            <IconAlignTextRight />
          </el-radio-button>
        </el-tooltip>
      </el-radio-group>
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

    <!-- <div class="row">
      <div style="flex: 2;">字间距：</div>
      <el-select style="flex: 3" suffix-icon="IconFullwidth" v-model="handleElement.charSpacing">
        <el-option v-for="item in CharSpaceLibs" :key="item" :value="item" :label="item"></el-option>
      </el-select>
    </div> -->

    <!-- <el-divider />
    <ElementGradient /> -->
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
import { computed, ref, watch } from 'vue'
import { useMainStore, useTemplatesStore } from '@/store'
import { storeToRefs } from 'pinia'
import ElementStroke from '../Components/ElementStroke.vue'
import ElementShadow from '../Components/ElementShadow.vue'
import ElementOpacity from '../Components/ElementOpacity.vue'
import ElementPatterns from '../Components/ElementPatterns.vue'
import ElementFill from '../Backgrounds/ElementFill.vue'
import { FontSizeLibs, LineHeightLibs, CharSpaceLibs } from '@/configs/texts'
import { WEB_FONTS } from '@/configs/fonts'
import { TextboxElement } from '@/types/canvas'
import { FontGroupOption } from '@/types/elements'
import useCanvas from '@/views/Canvas/useCanvas'

const mainStore = useMainStore()
const templatesStore = useTemplatesStore()
const { canvasObject, availableFonts } = storeToRefs(mainStore)
const [ canvas ] = useCanvas()
const handleElement = computed(() => canvasObject.value as TextboxElement)

const hasFontWeight = ref(false)
const hasFontStyle = ref(false)
const fontOptionGroups = ref<FontGroupOption[]>([
  {
    label: '系统字体',
    options: availableFonts.value
  },
  {
    label: '在线字体',
    options: WEB_FONTS
  }
])

// 修改字体族
const handleElementFontFamily = () => {
  canvas.renderAll()
}

// 修改字体族
const handleElementFontSize = () => {
  canvas.renderAll()
}

// 修改字体颜色
const updateFontColor = (color: string) => {
  handleElement.value.fill = color
  // if (handleElement.value.fillType === 0) {
  //   handleElement.value.fill = color
  // }
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改背景颜色
const updateBackgroundColor = (color: string) => {
  handleElement.value.backgroundColor = color
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改字体大小
const handleElementFontsize = (mode: string) => {
  if (!handleElement.value.fontSize) {
    handleElement.value.fontSize = 36
  }
  if (mode === '+') {
    handleElement.value.fontSize += 1
  }
  else {
    handleElement.value.fontSize -= 1
  }
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改字体加粗
const handleElementBlod = () => {
  const fontBold = 'bold', fontNormal = 'normal'
  if (handleElement.value.isEditing) {
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
      handleElement.value.fontWeight = fontNormal
      for (let i in elementStyle) {
        for (let j in elementStyle[i]) {
          elementStyle[i][j].fontWeight = fontNormal
        }
      }
    }
    else {
      handleElement.value.fontWeight = fontBold
      for (let i in elementStyle) {
        for (let j in elementStyle[i]) {
          elementStyle[i][j].fontWeight = fontBold
        }
      }
    }
  }
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改斜体
const handleElementItalic = () => {
  if (handleElement.value.fontStyle === 'italic') {
    handleElement.value.fontStyle = 'normal'
    hasFontStyle.value = false
  } 
  else {
    handleElement.value.fontStyle = 'italic'
    hasFontStyle.value = true
  }
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改删除线
const handleElementLinethrough = () => {
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改中划线
const handleElementUnderline = () => {
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改字体居中
const handleTextAlign = () => {
  templatesStore.modifedElement()
  canvas.renderAll()
}

// 修改缩进
const handleElementCharSpacing = (mode: '+' | '-') => {
  if (!handleElement.value.charSpacing) {
    handleElement.value.charSpacing = 3
  }
  if (mode === '+') {
    handleElement.value.charSpacing += 10
  }
  else {
    handleElement.value.charSpacing -= 10
  }
  templatesStore.modifedElement()
  canvas.renderAll()
}

const handleElementStyleClear = () => {
  handleElement.value.cleanStyle('fontWeight')
  templatesStore.modifedElement()
  canvas.renderAll()
}

// watch(handleElement, () => {
//   if (!handleElement.value) return
//   if (handleElement.value.fillType === 0 || !handleElement.value.fillType) {
//     handleElement.value.color = handleElement.value.fill as string
//   }
// })
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