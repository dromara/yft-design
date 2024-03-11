<template>
  <div
    @mousedown="() => setThumbnailsFocus(true)"
    v-click-outside="() => setThumbnailsFocus(false)"
    v-contextmenu="contextMenusThumbnails"  
  >
    <div class="thumb-handle">
      <div class="btn" @click="createTemplate()"><IconPlus class="icon" />{{ t('message.addPage') }}</div>
    </div>
    <Draggable
      class="thumb-content"
      :modelValue="templates"
      :animation="300"
      :scroll="true"
      :scrollSensitivity="50"
      :setData="null"
      @end="handleDragEnd"
      itemKey="id"
    >
      <template #item="{ element, index }">
        <div
          :class="{
            'thumbnail-item': true,
            'active': templateIndex === index,
            'selected': selectedTemplatesIndex.includes(index),
          }"
          @mousedown="$event => handleClickTemplateThumbnail($event, index)"
          v-contextmenu="contextmenusThumbnailItem"
        >
          <div class="label" :class="{ 'offset-left': index >= 99 }">{{ fillDigit(index + 1, 2) }}</div>
          <ThumbnailTemplate class="thumbnail" :template="element" :size="120" :visible="index < templatesLoadLimit" />
        </div>
      </template>
    </Draggable>

    <div class="thumb-number">{{ t('message.pages') }}{{ templateIndex + 1 }} / {{ templates.length }}</div>
  </div>
</template>

<script lang="ts" setup>
import useLoadTemplates from '@/hooks/useLoadTemplates'
import useHandleTemplate from '@/hooks/useHandleTemplate'
import ThumbnailTemplate from '@/views/Editor/CanvasThumb/ThumbnailTemplate.vue'
import Draggable from 'vuedraggable'
import useI18n from '@/hooks/useI18n'
import { contextMenusThumbnails } from '@/configs/contextMenu'
import { useMainStore, useTemplatesStore, useKeyboardStore } from '@/store'
import { ContextMenu } from '@/components/ContextMenu/types'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { fillDigit } from '@/utils/common/common'

const mainStore = useMainStore()
const templatesStore = useTemplatesStore()
const keyboardStore = useKeyboardStore()
const { t } = useI18n()
const { templatesLoadLimit } = useLoadTemplates()
const { templates, templateIndex } = storeToRefs(templatesStore)
const { selectedTemplatesIndex: _selectedTemplatesIndex, thumbnailsFocus, canvasObject } = storeToRefs(mainStore)
const { ctrlKeyState, shiftKeyState } = storeToRefs(keyboardStore)
const { createTemplate, deleteTemplate, sortTemplates, cutTemplate, pasteTemplate } = useHandleTemplate()

const selectedTemplatesIndex = computed(() => [..._selectedTemplatesIndex.value, templateIndex.value])

const contextmenusThumbnailItem = (): ContextMenu[] => {
  return [
    {
      text: '剪切',
      subText: 'Ctrl + X',
      handler: cutTemplate,
    },
    {
      text: '复制',
      subText: 'Ctrl + C',
      // handler: copySlide,
    },
    {
      text: '粘贴',
      subText: 'Ctrl + V',
      handler: pasteTemplate,
    },
    {
      text: '全选',
      subText: 'Ctrl + A',
      // handler: selectAllSlide,
    },
    { divider: true },
    {
      text: '新建页面',
      subText: 'Enter',
      handler: createTemplate,
    },
    {
      text: '复制页面',
      subText: 'Ctrl + D',
      // handler: copyAndPasteSlide,
    },
    {
      text: '删除页面',
      subText: 'Delete',
      handler: () => deleteTemplate(),
    },
    { divider: true },
    {
      text: '从当前预览',
      subText: 'Shift + F5',
      // handler: enterScreening,
    },
  ]
}

// 设置缩略图工具栏聚焦状态（只有聚焦状态下，该部分的快捷键才能生效）
const setThumbnailsFocus = (focus: boolean) => {
  if (thumbnailsFocus.value === focus) return
  mainStore.setThumbnailsFocus(focus)

  if (!focus) mainStore.updateSelectedTemplatesIndex([])
}

// 拖拽调整顺序后进行数据的同步
const handleDragEnd = (eventData: { newIndex: number; oldIndex: number }) => {
  const { newIndex, oldIndex } = eventData
  sortTemplates(newIndex, oldIndex)
}


// 点击缩略图
const handleClickTemplateThumbnail = (e: MouseEvent, index: number) => {
  const isMultiSelected = selectedTemplatesIndex.value.length > 1

  if (isMultiSelected && selectedTemplatesIndex.value.includes(index) && e.button !== 0) return

  // 按住Ctrl键，点选页面，再次点击已选中的页面则取消选中
  if (ctrlKeyState.value) {
    if (templateIndex.value === index) {
      if (!isMultiSelected) return

      // const newSelectedSlidesIndex = selectedSlidesIndex.value.filter(item => item !== index)
      // mainStore.updateSelectedSlidesIndex(newSelectedSlidesIndex)
      // changeSlideIndex(selectedSlidesIndex.value[0])
    }
    else {
      if (selectedTemplatesIndex.value.includes(index)) {
        const newSelectedSlidesIndex = selectedTemplatesIndex.value.filter(item => item !== index)
        // mainStore.updateSelectedSlidesIndex(newSelectedSlidesIndex)
      }
      else {
        const newSelectedSlidesIndex = [...selectedTemplatesIndex.value, index]
        // mainStore.updateSelectedSlidesIndex(newSelectedSlidesIndex)
        // changeSlideIndex(index)
      }
    }
  }
  // 按住Shift键，选择范围内的全部页面
  else if (shiftKeyState.value) {
    if (templateIndex.value === index && !isMultiSelected) return

    let minIndex = Math.min(...selectedTemplatesIndex.value)
    let maxIndex = index

    if (index < minIndex) {
      maxIndex = Math.max(...selectedTemplatesIndex.value)
      minIndex = index
    }

    const newSelectedSlidesIndex = []
    for (let i = minIndex; i <= maxIndex; i++) newSelectedSlidesIndex.push(i)
    // mainStore.updateSelectedSlidesIndex(newSelectedSlidesIndex)
    // changeSlideIndex(index)
  }
  // 正常切换页面
  else {
    mainStore.updateSelectedTemplatesIndex([])
    changeSlideIndex(index)
  }
}

// 切换页面
const changeSlideIndex = (index: number) => {
  if (templateIndex.value === index) return
  templatesStore.setTemplateIndex(index)
  templatesStore.renderTemplate()
}

</script>

<style lang="scss" scoped>
.thumb-handle {
  height: 40px;
  font-size: 12px;
  display: flex;
  flex-shrink: 0;
  border-bottom: 1px solid $borderColor;
  cursor: pointer;

  .btn {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: $lightGray;
    }
  }
  .select-btn {
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid $borderColor;

    &:hover {
      background-color: $lightGray;
    }
  }

  .icon {
    margin-right: 3px;
    font-size: 14px;
  }
}
.thumb-content {
  padding: 5px 0;
  flex: 1;
  overflow: auto;
}
.thumbnail-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0;

  .thumbnail {
    outline: 1px solid rgba($color: $themeColor, $alpha: .15);
  }

  &.active {
    .label {
      color: $themeColor;
    }
    .thumbnail {
      outline-color: $themeColor;
    }
  }
  &.selected {
    .thumbnail {
      outline-color: $themeColor;
    }
  }
}
.label {
  font-size: 12px;
  color: #999;
  width: 20px;
  cursor: grab;

  &.offset-left {
    position: relative;
    left: -4px;
  }

  &:active {
    cursor: grabbing;
  }
}
.thumb-number {
  height: 0;
  font-size: 12px;
  border-top: 1px solid $borderColor;
  line-height: 40px;
  text-align: center;
  color: #666;
}
</style>