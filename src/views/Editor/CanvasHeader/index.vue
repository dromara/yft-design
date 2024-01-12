<template>
  <div>
    <div class="left-handler">
      <el-tooltip placement="top" :hide-after="0">
        <template #content>撤销</template>
        <IconBack class="handler-item" :class="{ 'disable': !canUndo }" @click="undo()"/>
      </el-tooltip>
      <el-tooltip placement="top" :hide-after="0">
        <template #content>重做</template>
        <IconNext class="handler-item" :class="{ 'disable': !canRedo }" @click="redo()"/>
      </el-tooltip>
      <el-tooltip placement="top" :hide-after="0">
        <template #content>组合</template>
        <IconGroup class="handler-item" :class="{ 'disable': !canGroup }" @click="group()"/>
      </el-tooltip>
      <el-tooltip placement="top" :hide-after="0">
        <template #content>解组</template>
        <IconUngroup class="handler-item" :class="{ 'disable': !canUnGroup }" @click="ungroup()"/>
      </el-tooltip>
    </div>

    <div class="center-handler" v-show="canIntersection">
      <el-dropdown trigger="click">
        <span class="handler-dropdown">
          <el-tooltip placement="top" :hide-after="0">
            <template #content>并集</template>
            <IconUnionSelection class="handler-icon"/>
          </el-tooltip>
          <IconDown class="handler-icon icon-down"/>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="intersection(0)">
              <IconUnionSelection class="handler-item"/>并集
            </el-dropdown-item>
            <el-dropdown-item @click="intersection(1)">
              <IconSubtractSelectionOne class="handler-item"/>减去顶层
            </el-dropdown-item>
            <el-dropdown-item @click="intersection(2)">
              <IconIntersectSelection class="handler-item"/>交集
            </el-dropdown-item>
            <el-dropdown-item @click="intersection(3)">
              <IconExcludeSelection class="handler-item"/>排除重叠
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="right-handler">
      <IconMinus class="handler-item" @click="scaleCanvas('-')" />
      <el-popover placement="bottom" trigger="click" width="100" popper-class="viewport-size">
        <template #reference>
          <span class="text" ref="scaleRef">{{canvasZoom}}</span>
        </template>
        <div class="viewport-size-preset">
          <div class="preset-item" v-for="item in canvasZoomPresets" :key="item" @click="applyCanvasPresetScale(item)">{{item}}%</div>
        </div>
      </el-popover>
      <IconPlus class="handler-item"  @click="scaleCanvas('+')" />
      <el-tooltip placement="top">
        <template #content>适应屏幕</template>
        <IconFullScreen class="handler-item" @click="resetCanvas()"/>
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElementNames } from '@/types/elements'
import { storeToRefs } from 'pinia'
import { Object as FabricObject, Group } from 'fabric'
import { useFabricStore, useMainStore, useSnapshotStore, useTemplatesStore } from "@/store"
import useCanvas from '@/views/Canvas/useCanvas'
import useHandleTool from '@/hooks/useHandleTool'
import useCanvasScale from '@/hooks/useCanvasScale'
import useHandleElement from '@/hooks/useHandleElement'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

const fabricStore = useFabricStore()
const mainStore = useMainStore()
const templatesStore = useTemplatesStore()
const { alignElement, layerElement } = useHandleTool()
const { setCanvasScalePercentage, scaleCanvas, resetCanvas } = useCanvasScale()
const { combineElements, uncombineElements, intersectElements } = useHandleElement()
const { zoom } = storeToRefs(fabricStore)
const { canvasObject } = storeToRefs(mainStore)


const scaleRef = ref()
const canvasZoom = computed(() => Math.round(zoom.value * 100) + '%')
const canvasZoomPresets = [200, 150, 100, 80, 50]

const { canUndo, canRedo } = storeToRefs(useSnapshotStore())

const { redo, undo } = useHistorySnapshot()

const handleElement = computed(() => canvasObject.value as FabricObject)

const canGroup = computed(() => {
  if (!handleElement.value) return false
  return handleElement.value.type === ElementNames.ACTIVE
})
const canUnGroup = computed(() => {
  if (!handleElement.value) return false
  return handleElement.value.type === ElementNames.GROUP
})

const canIntersection = computed(() => {
  const [ canvas ] = useCanvas()
  if (!handleElement.value) return false
  if (handleElement.value.type === ElementNames.GROUP) {
    const groupObject = handleElement.value as Group
    const sonObjects = groupObject._objects.filter(ele => ele.type === ElementNames.PATH)
    if (groupObject._objects.length === 2 && sonObjects && sonObjects.length === 2) return true
    return false
  }
  if (handleElement.value.type !== ElementNames.ACTIVE) return false
  
  const activeObjects = canvas.getActiveObjects()
  return activeObjects.length === 2 && activeObjects.filter(ele => ele.type === ElementNames.PATH).length === 2
})

// 组合
const group = () => {
  if (!handleElement.value || handleElement.value.type !== ElementNames.ACTIVE) return
  combineElements()
}

// 解除组合
const ungroup = () => {
  if (!handleElement.value || handleElement.value.type !== ElementNames.GROUP) return
  uncombineElements()
}

const intersection = (val: number) => {
  if (!handleElement.value) return
  intersectElements(val)
}

const applyCanvasPresetScale = (value: number) => {
  setCanvasScalePercentage(value)
}
// const setZoom = ()
</script>

<style lang="scss" scoped>
.left-handler {
  display: flex;
  align-items: center;
}
.center-handler {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  .handler-icon {
    font-size: 14px;
    width: 18px;
  }
  .icon-down {
    transition: margin-top 0.05s;
  }
  .handler-item {
    width: 32px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 2px;
    border-radius: $borderRadius;
  }
}
.handler-item {
  margin: 0 10px;
  font-size: 14px;
  overflow: hidden;
  cursor: pointer;

  &.disable {
    opacity: .5;
    cursor: not-allowed;
  }
}
.right-handler {
  display: flex;
  align-items: center;

  .text {
    width: 40px;
    text-align: center;
    cursor: pointer;
  }
}
.preset-item {
  padding: 8px 20px;
  text-align: center;
  cursor: pointer;

  &:hover {
    color: $themeColor;
  }
}
.center-handler .handler-dropdown {
  display: flex;
  width: 42px;
  height: 24px;
  align-items: center;
  padding: 2px;
  justify-content: center;
  border-radius: $borderRadius;
  &:hover {
    background: #f1f1f1;
    .icon-down {
      margin-top: 3px;
    }
  }
}
</style>

<style>
.el-popover.el-popper.viewport-size {
  min-width: 100px;
  padding: 0;
}
</style>