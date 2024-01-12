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

    <div class="center-handler">
      <el-tooltip placement="top" :hide-after="0">
        <template #content>交叉</template>
        <IconIntersection class="handler-item" @click="intersection()"/>
      </el-tooltip>
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
import { ElementNames, AlignCommand, LayerCommand } from '@/types/elements'
import { storeToRefs } from 'pinia'
import { CanvasElement } from '@/types/canvas'
import { useFabricStore, useMainStore, useSnapshotStore, useTemplatesStore } from "@/store"
import useCanvas from '@/views/Canvas/useCanvas'
import useHandleTool from '@/hooks/useHandleTool'
import useCanvasScale from '@/hooks/useCanvasScale'
import useHandleElement from '@/hooks/useHandleElement'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import { Object as FabricObject } from 'fabric'

const fabricStore = useFabricStore()
const mainStore = useMainStore()
const templatesStore = useTemplatesStore()
const { alignElement, layerElement } = useHandleTool()
const { setCanvasScalePercentage, scaleCanvas, resetCanvas } = useCanvasScale()
const { combineElements, uncombineElements, intersectElements } = useHandleElement()
const { zoom } = storeToRefs(fabricStore)
const { canvasObject } = storeToRefs(mainStore)
const layerRef = ref()
const layerPopoverRef = ref()

const alignRef = ref()
const alignPopoverRef = ref()

const rotateRef = ref()
const rotatePopoverRef = ref()

const rotate = ref(0)

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

const lock = computed(() => {
  if (!handleElement.value) return false
  return handleElement.value.lockMovementX && handleElement.value.lockMovementY ? true : false
})

// // 锁定解锁
const changeElementLock = (status: boolean) => {
  if (!handleElement.value) return
  handleElement.value.lockMovementY = handleElement.value.lockMovementX = status
}

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

const intersection = () => {
  if (!handleElement.value) return
  intersectElements()
}

// // 修改旋转
// const changeRotate = (value: number) => {
//   const [ canvas ] = useCanvas()
//   if (!handleElement.value || !canvas) return
//   handleElement.value.set({angle: value})
//   canvas.renderAll()
//   templatesStore.modifedElement()
// }

// 修改旋转45度（顺时针或逆时针）
// const changeRotate45 = (command: '+' | '-') => {
//   const [ canvas ] = useCanvas()
//   if (!handleElement.value || !canvas) return
//   let _rotate = Math.floor(rotate.value / 45) * 45
//   if (command === '+') _rotate = _rotate + 45
//   else if (command === '-') _rotate = _rotate - 45
//   if (_rotate < -180) _rotate = -180
//   if (_rotate > 180) _rotate = 180
//   rotate.value = _rotate
//   handleElement.value.angle = _rotate
//   canvas.renderAll()
//   templatesStore.modifedElement()
// }

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

  .handler-item {
    width: 32px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 2px;
    border-radius: $borderRadius;

    &:not(.group-btn):hover {
      background-color: #f1f1f1;
    }

    &.active {
      color: $themeColor;
    }

    &.group-btn {
      width: auto;
      margin-right: 4px;

      &:hover {
        background-color: #f3f3f3;
      }

      .icon, .arrow {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .icon {
        width: 26px;
        padding: 0 2px;

        &:hover {
          background-color: #e9e9e9;
        }
        &.active {
          color: $themeColor;
        }
      }
      .arrow {
        font-size: 12px;

        &:hover {
          background-color: #e9e9e9;
        }
      }
    }
  }
}
.handler-icon-row {
  justify-content: center;
}
.mt-10 {
  margin-top: 10px;
}
.position-text {
  display: flex;
  align-items: center;
}
.position-input {
  display: flex;
}
.position-num {
  display: flex;
  justify-content: flex-end;
}
.text-btn {
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #efefef;
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

  .viewport-size {
    font-size: 13px;
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
.text-type-item {
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }

  & + .text-type-item {
    margin-top: 3px;
  }
}
</style>

<style>
.el-popover.el-popper.viewport-size {
  min-width: 100px;
  padding: 0;
}
</style>