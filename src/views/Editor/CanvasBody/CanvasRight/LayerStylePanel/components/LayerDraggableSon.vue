<template>
  <Draggable
    class="layer-draggable"
    group="group"
    :modelValue="props.elements"
    :animation="300"
    :scroll="true"
    :scrollSensitivity="50"
    :setData="null"
    :move="layerElement"
    @change="sortElement"
    itemKey="id"
  >
    <template #item="{ element }">
      <div v-contextmenu="contextMenusThumbnails">
        <LayerDraggableCom :index="props.index" :element="element" />
        <LayerDraggableSelf v-if="element.type.toLowerCase() === ElementNames.GROUP && element.objects" v-show="element.isShow" :elements="element.objects" :index="props.index + 1"/>
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
import LayerDraggableSelf from './LayerDraggableSelf.vue'
import LayerDraggableCom from './LayerDraggableCom.vue'

const { sortElement, layerElement } = useHandleElement()

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

</script>

<style lang="scss" scoped>
.layer-draggable {
  overflow-y: scroll;
  overflow-x: hidden;
  height: calc(100% - 100px);
}
</style>