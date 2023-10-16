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
      <div v-contextmenu="contextMenusThumbnails">
        <LayerDraggableCom :index="props.index" :element="element" />
        <LayerDraggableSon v-if="element.type.toLowerCase() === ElementNames.GROUP && element.objects" v-show="element.isShow" :elements="element.objects" :index="props.index + 1"/>
      </div>
    </template>
  </Draggable>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { Object as FabricObject } from 'fabric'
import { ElementNames } from '@/types/elements'
import { contextMenusThumbnails } from '@/configs/contextMenu'
import Draggable from 'vuedraggable'
import useHandleElement from '@/hooks/useHandleElement'
import LayerDraggableSon from './LayerDraggableSon.vue'
import LayerDraggableCom from './LayerDraggableCom.vue'


const {  sortElement } = useHandleElement()

const props = defineProps({
  elements: {
    type: Object as PropType<FabricObject[]>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  }
})

// 拖拽调整顺序后进行数据的同步
const handleDragMoved = (eventData: { moved: { newIndex: number, oldIndex: number, element: FabricObject} }) => {
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