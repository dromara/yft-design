<template>
  <Draggable
    class="layer-draggable"
    :modelValue="props.elements"
    :animation="300"
    :scroll="true"
    :scrollSensitivity="50"
    :setData="null"
    @change="handleDragMoved"
    itemKey="id"
  >
    <template #item="{ element }">
      <div v-contextmenu="contextmenusThumbnailItem">
        <LayerDraggableCom :index="props.index" :element="element" />
        <LayerDraggableSelf v-if="element.type === ElementNames.GROUP && element.objects" v-show="element.isShow" :elements="element.objects" :index="props.index + 1"/>
      </div>
    </template>
  </Draggable>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import { CanvasOption } from '@/types/option'
import { ElementNames } from '@/types/elements'
import Draggable from 'vuedraggable'
import useHandleElement from '@/hooks/useHandleElement'
import LayerDraggableSelf from './LayerDraggableSelf.vue'
import LayerDraggableCom from './LayerDraggableCom.vue'

const { sortElement } = useHandleElement()

const props = defineProps({
  elements: {
    type: Object as PropType<CanvasOption[]>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  }
})

const contextmenusThumbnailItem = (): ContextmenuItem[] => {
  return [
    {
      text: '剪切',
      subText: 'Ctrl + X',
      // handler: cutTemplate,
    },
    {
      text: '复制',
      subText: 'Ctrl + C',
      // handler: copySlide,
    },
    {
      text: '粘贴',
      subText: 'Ctrl + V',
      // handler: pasteTemplate,
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
      // handler: createTemplate,
    },
    {
      text: '复制页面',
      subText: 'Ctrl + D',
      // handler: copyAndPasteSlide,
    },
    {
      text: '删除页面',
      subText: 'Delete',
      // handler: () => deleteTemplate(),
    },
    { divider: true },
    {
      text: '从当前预览',
      subText: 'Shift + F5',
      // handler: enterScreening,
    },
  ]
}

// 拖拽调整顺序后进行数据的同步
const handleDragMoved = (eventData: { moved: { newIndex: number, oldIndex: number, element: CanvasOption} }) => {
  sortElement(eventData.moved.newIndex, eventData.moved.oldIndex, eventData.moved.element)
}
</script>

<style lang="scss" scoped>
.layout-search {
  margin: 0 auto;
  width: 68%;
  padding: 20px 10px 10px;
}
.layer-content {
  padding: 0 10px;
  .element-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    padding: 5px;
    border: 1px solid $borderColor;
    border-radius: 5px;
    margin-bottom: 5px;

    .element-info {
      display: flex;
      align-items: center;
    }

    .element-handler {
      display: flex;
    }

    &:not(.group-btn):hover {
      border: 1px solid $themeColor;
    }
  }
  .layer-active {
    border: 1px solid $themeColor;
  }
}
.element-type {
  width: 58px;
  margin-left: 10px;
  font-size: 12px;
}

.element-text {
  width: 50px;
  font-size: 12px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.common-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $borderRadius;

  &:not(.group-btn):hover {
    background-color: #f1f1f1;
  }
}
</style>