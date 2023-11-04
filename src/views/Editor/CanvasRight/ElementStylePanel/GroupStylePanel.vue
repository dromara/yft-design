<template>
  <div class="multi-style-panel">
    <ElementPosition/>
    <el-divider />

    <div class="row">
      <div style="flex: 2;">填充颜色：</div>
      <el-popover trigger="click" width="265">
        <template #reference>
          <ColorButton :color="fillColor" style="flex: 3;" />
        </template>
        <ColorPicker :modelValue="fillColor" @update:modelValue="(value: string) => updateFillColor(value)"/>
      </el-popover>
    </div>

    <el-divider />

    <div class="row">
      <div style="flex: 2;">边框样式：</div>
      <el-select style="flex: 3;" v-model="outlineStyle" @change="changeOutlineStyle">
        <el-option :value="0" label="实线边框"></el-option>
        <el-option :value="1" label="虚线边框"></el-option>
      </el-select>
    </div>
    <div class="row">
      <div style="flex: 2;">边框颜色：</div>
      <el-popover trigger="click" width="265">
        <template #reference>
          <ColorButton :color="outlineColor || '#000'" style="flex: 3;" />
        </template>
        <ColorPicker :modelValue="outlineColor" @update:modelValue="(value: string) => updateOutlineColor(value)"/>
      </el-popover>
    </div>
    <div class="row">
      <div style="flex: 2;">边框粗细：</div>
      <el-input-number style="flex: 3;" v-model="outlineWidth" @change="changeOutlineWidth"></el-input-number>
    </div>

    <el-divider />

    <div v-if="hasTextbox && handleTextboxElement">
      <el-row>
        <el-col :span="12">
          <el-select v-model="handleTextboxElement.fontFamily" @change="changeFontFamily">
            <el-option-group v-for="group in fontOptionGroups" :key="group.label" :label="group.label">
              <el-option v-for="item in group.options" :key="item" :value="item.value" :label="item.label" :style="{fontFamily: item.value}"></el-option>
            </el-option-group>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-select v-model="handleTextboxElement.fontSize" @change="changeFontSize">
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
                    <TextColorButton :color="fillColor">
                      <IconText />
                    </TextColorButton>
                  </el-button>
                </template>
                <ColorPicker :modelValue="fillColor" @update:modelValue="(color: string) => updateFontColor(color)"/>
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
                    <TextColorButton :color="backgroundColor">
                      <IconHighLight />
                    </TextColorButton>
                  </el-button>
                </template>
                <ColorPicker :modelValue="backgroundColor" @update:modelValue="(color: string) => updateBackgroundColor(color)"/>
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
        <el-radio-group class="full-ratio" >
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { FontSizeLibs, LineHeightLibs, CharSpaceLibs } from '@/configs/texts'
import { WEB_FONTS } from '@/configs/fonts'
import { ElementNames, FontGroupOption } from '@/types/elements'
import { CanvasElement, GroupElement, ImageElement, PathElement, TextboxElement } from '@/types/canvas'
import ElementPosition from '../Components/ElementPosition.vue'
import useCanvas from '@/views/Canvas/useCanvas'
// 组合元素编辑
// http://jsfiddle.net/crandellws/1cad3e4o/
const [ canvas ] = useCanvas()
const { activeElementList, canvasObject, systemFonts } = storeToRefs(useMainStore())

const handleGroupElement = computed(() => canvasObject.value as GroupElement)
const handleTextboxElement = computed(() => {
  if (!handleGroupElement.value) return
  if (!handleGroupElement.value.objects) return
  const textboxElements = handleGroupElement.value._objects.filter(obj => obj.type === ElementNames.TEXTBOX)
  return textboxElements[0] as TextboxElement
})
const handleOutlineElement = computed(() => {
  if (!handleGroupElement.value) return
  if (!handleGroupElement.value._objects) return
  const outlineElements = handleGroupElement.value._objects.filter(obj => obj.type === ElementNames.IMAGE || obj.type === ElementNames.PATH)
  return outlineElements[0] as ImageElement | PathElement
})
const hasTextbox = computed(() => handleTextboxElement.value ? true : false)

const fillColor = ref('#fff')
const outlineColor = ref('#fff')
const fontColor = ref('#fff')
const backgroundColor = ref('#fff')

const outlineStyle = ref(0)
const outlineWidth = ref(0)

// watch(handleGroupElement, () => {
//   if (!handleGroupElement.value) return
//   if (handleTextboxElement.value) {
//     fontColor.value = handleTextboxElement.value.fill as string
//   }
//   if (handleOutlineElement.value && handleOutlineElement.value.stroke && handleOutlineElement.value.strokeWidth) {
//     outlineColor.value = handleOutlineElement.value.stroke as string
//     outlineWidth.value = handleOutlineElement.value.strokeWidth
//   }
// })
const computedFillColor = computed(() => {
  if (!handleGroupElement.value) return ''
})


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


// 修改字体大小
const handleElementFontsize = (mode: string) => {
  if (mode === '+') {
    handleGroupElement.value._objects.forEach(obj => {
      if (obj.type === ElementNames.TEXTBOX) {
        const textbox = obj as TextboxElement
        const fontSize = textbox.fontSize ? textbox.fontSize : 36
        textbox.set({fontSize: fontSize + 1})
      }
    })
  }
  else {
    handleGroupElement.value._objects.forEach(obj => {
      if (obj.type === ElementNames.TEXTBOX) {
        const textbox = obj as TextboxElement
        const fontSize = textbox.fontSize ? textbox.fontSize : 36
        textbox.set({fontSize: fontSize - 1})
      }
    })
  }
  canvas.renderAll()
}

// 修改填充演示
const updateFillColor = (color: string) => {
  fillColor.value = color
  handleGroupElement.value._objects.forEach(obj => {
    const canvasElement = obj as CanvasElement
    canvasElement.fill = color
  })
  canvas.renderAll()
}

// 修改字体颜色
const updateFontColor = (color: string) => {
  fontColor.value = color
  handleGroupElement.value._objects.forEach(obj => {
    if (obj.type === ElementNames.TEXTBOX) {
      const textbox = obj as TextboxElement
      textbox.set({fill: color})
    }
  })
  canvas.renderAll()
}

// 修改背景颜色
const updateBackgroundColor = (color: string) => {
  backgroundColor.value = color
  handleGroupElement.value._objects.forEach(obj => {
    if (obj.type === ElementNames.TEXTBOX) {
      const textbox = obj as TextboxElement
      textbox.set({backgroundColor: color})
    }
  })
  canvas.renderAll()
}

// 修改字体大小
const changeFontSize = () => {
  if (!handleTextboxElement.value) return
  handleGroupElement.value._objects.forEach(obj => {
    if (obj.type === ElementNames.TEXTBOX) {
      const textbox = obj as TextboxElement
      textbox.set({fontSize: handleTextboxElement.value?.fontSize})
    }
  })
  canvas.renderAll()
}

// 修改字体样式
const changeFontFamily = () => {
  if (!handleTextboxElement.value) return
  handleGroupElement.value._objects.forEach(obj => {
    if (obj.type === ElementNames.TEXTBOX) {
      const textbox = obj as TextboxElement
      textbox.set({fontFamily: handleTextboxElement.value?.fontFamily})
    }
  })
  canvas.renderAll()
}

// 修改边框颜色
const updateOutlineColor = (color: string) => {
  outlineColor.value = color
  handleGroupElement.value._objects.forEach(obj => {
    if (obj.type === ElementNames.IMAGE || obj.type === ElementNames.PATH) {
      const element = obj as PathElement | ImageElement
      element.stroke = color
    }
  })
  canvas.renderAll()
}

// 修改边框宽度
const changeOutlineWidth = () => {
  handleGroupElement.value._objects.forEach(obj => {
    if (obj.type === ElementNames.IMAGE || obj.type === ElementNames.PATH) {
      const element = obj as PathElement | ImageElement
      element.strokeWidth = outlineWidth.value
    }
  })
  canvas.renderAll()
}

// 修改边框样式
const changeOutlineStyle = () => {
  handleGroupElement.value._objects.forEach(obj => {
    if (obj.type === ElementNames.IMAGE || obj.type === ElementNames.PATH) {
      const element = obj as PathElement | ImageElement
      element.strokeWidth = outlineWidth.value
    }
  })
  canvas.renderAll()
}

// 修改边框/线条样式
// const updateOutline = (outlineProps: Partial<PPTElementOutline>) => {

  // for (const el of activeElementList.value) {
  //   if (
  //     el.type === 'text' ||
  //     el.type === 'image' ||
  //     el.type === 'shape' ||
  //     el.type === 'table' ||
  //     el.type === 'chart'
  //   ) {
  //     const outline = el.outline || { width: 2, color: '#000', style: 'solid' }
  //     const props = { outline: { ...outline, ...outlineProps } }
  // }
  // outline.value = { ...outline.value, ...outlineProps }
// }
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.font-size-btn {
  padding: 0;
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
</style>