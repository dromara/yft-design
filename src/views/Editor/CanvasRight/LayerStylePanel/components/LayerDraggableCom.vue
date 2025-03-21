<template>
  <div class="layer-content">
    <div 
      class="element-content" 
      :class="handleElement && handleElement.id === element.id ? 'layer-active' : ''" 
      @click.stop="selectElement(element.id)"
      @mousemove.stop="mouseoverElement(element.id)"
      @mouseleave.stop="mouseleaveElement(element.id)"
      >
      <div class="element-info">
        
        <IconPreviewOpen class="common-icon" v-if="element.visible" @click.stop="visibleElement(element.id)"/>
        <IconPreviewClose class="common-icon" v-else @click.stop="visibleElement(element.id)"/>
        <span class="common-span" v-if="props.index"/>
        <div v-if="element.type.toLowerCase() === ElementNames.GROUP">
          <IconDownOne v-if="(element as Group).isShow" class="common-icon text-[20px]" @click.stop="showElement(element.id)"/>
          <IconRightOne v-else class="common-icon text-[20px]" @click.stop="showElement(element.id)"/>
        </div>
        <div class="element-type">{{ element.type }}</div>
        <i class="icon-font iconfont icon-mask" v-if="(element as FabricImage).mask" @click.stop="maskElement(element.id)"/>
        <span class="icon-span" v-else/>
        <div class="mask-image" v-if="(element as FabricImage).mask">
          <img :src="(element as FabricImage).mask?.src" alt="">
        </div>
        <div class="element-text" v-if="element.type === ElementNames.TEXTBOX || element.type === ElementNames.TEXT">{{ (element as TextboxElement).text }}</div>
        <div class="element-layer">
          <el-input v-if="element.id == handleElementId" v-model="element.layer" @blur="blurElement" size="small"></el-input>
          <p v-else @dblclick.stop="dbclickElement(element.id)">{{ element.layer ? element.layer : element.id }}</p>
        </div>
      </div>
      
      <div class="element-handler">
        <el-tooltip placement="top" :hide-after="0" :content="element.lockMovementX && element.lockMovementY ? '解锁' : '锁定'">
          <IconLock class="common-icon" v-if="element.lockMovementX && element.lockMovementY" @click.stop="lockElement(element.id, false)"/>
          <IconUnlock class="common-icon" v-else @click.stop="lockElement(element.id, true)"/>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useHandleElement from "@/hooks/useHandleElement"
import { useMainStore, useTemplatesStore } from '@/store'
import { TextboxElement } from '@/types/canvas'
import { ElementNames } from '@/types/elements'
import { FabricImage, FabricObject, Group } from 'fabric'
import { storeToRefs } from 'pinia'
import { computed, PropType } from 'vue'

const { 
  selectElement, 
  visibleElement, 
  lockElement, 
  deleteElement, 
  showElement, 
  mouseoverElement, 
  mouseleaveElement,
  checkElement,
  maskElement,
} = useHandleElement()

const props = defineProps({
  element: {
    type: Object as PropType<FabricObject>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  }
})

const mainStore = useMainStore()
const templatesStore = useTemplatesStore()
const { canvasObject, handleElementId } = storeToRefs(mainStore)
const { currentTemplate } = storeToRefs(templatesStore)
const handleElement = computed(() => canvasObject.value as FabricObject)

const inputRef = ref<HTMLInputElement | undefined>()

const dbclickElement = (eid: string) => {
  handleElementId.value = eid
}

const blurElement = () => {
  handleElementId.value = ''
}

</script>
<style lang="scss" scoped>
.layer-content {
  .element-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 35px;
    padding: 5px 2px;
    border: 1px solid $borderColor;
    border-radius: 2px;
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
  margin-left: 5px;
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
.element-layer {
  margin-left: 3px;
  width: 80px;
  font-size: 12px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  &:hover {
    text-overflow:inherit; 
    overflow: visible; 
    white-space: pre-line;
  }
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
.common-span {
  width: 24px;
}
.icon-font {
  cursor: pointer;
  border-radius: $borderRadius;
  &:not(.group-btn):hover {
    background-color: #f1f1f1;
  }
}
.icon-span {
  width: 16px;
}
.mask-image {
  height: 35px;
  padding: 3px 0;
  img {
    height: 100%;
    border: 1px solid $borderColor;
  }
}
</style>