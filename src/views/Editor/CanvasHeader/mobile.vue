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
        <template #content>取消组合</template>
        <IconUngroup class="handler-item" :class="{ 'disable': !canUnGroup }" @click="ungroup()"/>
      </el-tooltip>
    </div>

    <div class="right-handler">
      <el-tooltip placement="top" content="图层">
        <IconLayers class="handler-item" ref="layerRef"/>
      </el-tooltip>
      <el-popover ref="layerPopoverRef" :virtual-ref="layerRef" trigger="click" virtual-triggering width="240">
        <el-row class="handler-icon-row">
          <el-button-group>
            <el-tooltip placement="top" :hide-after="0" content="置顶">
              <el-button @click="bringToFront"><IconSendToBack/></el-button>
            </el-tooltip>
            <el-tooltip placement="top" :hide-after="0" content="置底">
              <el-button @click="sendToBack"><IconBringToFrontOne/></el-button>
            </el-tooltip>
            <el-tooltip placement="top" :hide-after="0" content="下移">
              <el-button @click="sendBackwards"><IconSentToBack/></el-button>
            </el-tooltip>
            <el-tooltip placement="top" :hide-after="0" content="上移">
              <el-button @click="bringForward"><IconBringToFront/></el-button>
            </el-tooltip>
          </el-button-group>
        </el-row>
      </el-popover>

      <el-tooltip placement="top" content="对齐">
        <IconAlignTextCenter class="handler-item" ref="alignRef"/>
      </el-tooltip>
      <el-popover ref="alignPopoverRef" :virtual-ref="alignRef" trigger="click" :width="200" virtual-triggering>
        <el-row class="handler-icon-row">
          <el-button-group>
            <el-tooltip placement="top" :hide-after="0" content="左对齐">
              <el-button @click="leftAlign"><IconAlignLeft/></el-button>
            </el-tooltip>
            <el-tooltip placement="top" :hide-after="0" content="水平居中">
              <el-button @click="verticallyAlign"><IconAlignVertically/></el-button>
            </el-tooltip>
            <el-tooltip placement="top" :hide-after="0" content="右对齐">
              <el-button @click="rightAlign"><IconAlignRight/></el-button>
            </el-tooltip>
          </el-button-group>
        </el-row>
        <el-row class="handler-icon-row mt-10">
          <el-button-group>
            <el-tooltip placement="top" :hide-after="0" content="上对齐">
              <el-button @click="topAlign"><IconAlignTop/></el-button>
            </el-tooltip>
            <el-tooltip placement="top" :hide-after="0" content="垂直居中">
              <el-button @click="horizontallyAlign"><IconAlignHorizontally/></el-button>
            </el-tooltip>
            <el-tooltip placement="top" :hide-after="0" content="下对齐">
              <el-button @click="bottomAlign"><IconAlignBottom/></el-button>
            </el-tooltip>
          </el-button-group>
        </el-row>
      </el-popover>

      <el-tooltip placement="top" content="旋转">
        <IconScreenRotation class="handler-item" ref="rotateRef"/>
      </el-tooltip>
      <el-popover ref="rotatePopoverRef" :virtual-ref="rotateRef" trigger="click" :width="360" virtual-triggering>
        <el-row>
          <el-col :span="4" class="position-text">旋转:</el-col>
          <el-col :span="7" class="position-input">
            <el-input-number controls-position="right" class="input-number" v-model="rotate" :max="360" @change="changeRotate(rotate)"></el-input-number>
          </el-col>
          <el-col :span="2" class="position-text"></el-col>
          <el-button-group>
            <el-button @click="changeRotate45('-')"><IconRotate/> -45°</el-button>
            <el-button @click="changeRotate45('+')"><IconRotate :style="{ transform: 'rotateY(180deg)' }"/> +45°</el-button>
          </el-button-group>
        </el-row>
      </el-popover>

      <el-tooltip placement="top" content="锁定">
        <IconLock class="handler-item" @click="changeElementLock(false)" v-if="lock"/>
        <IconUnlock class="handler-item" @click="changeElementLock(true)" v-else/>
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { ElementNames } from '@/types/elements'
import { storeToRefs } from 'pinia'
import { CanvasOption } from '@/types/option'
import { CanvasElement, GroupElement } from '@/types/canvas'
import { WorkSpaceDrawType } from '@/configs/canvas'
import { useFabricStore, useMainStore, useSnapshotStore, useTemplatesStore } from "@/store"
import useCanvas from '@/views/Canvas/useCanvas'
import useCanvasZindex from '@/hooks/useCanvasZindex'
import useCanvasScale from '@/hooks/useCanvasScale'
import useHandleElement from '@/hooks/useHandleElement'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

const fabricStore = useFabricStore()
const mainStore = useMainStore()
const templatesStore = useTemplatesStore()
const [ canvas ] = useCanvas()
const { setCanvasScalePercentage, scaleCanvas, resetCanvas } = useCanvasScale()
const { setZindex } = useCanvasZindex()
const { combineElements, uncombineElements, frontElement, backElement, forwardElement, backwardElement, sortElement } = useHandleElement()
const { zoom } = storeToRefs(fabricStore)
const { canvasObject } = storeToRefs(mainStore)
const { currentTemplate } = storeToRefs(templatesStore)

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

const canGroup = ref(false)
const canUnGroup = ref(false)

const lock = ref(false)

const handleElement = computed(() => canvasObject.value as CanvasElement)

// 锁定解锁
const changeElementLock = (status: boolean) => {
  lock.value = status
  if (!handleElement.value) return
  handleElement.value.lockMovementX = status
  handleElement.value.lockMovementY = status
}

// 组合
const group = () => {
  const [ canvas ] = useCanvas()
  const activeObject = canvas.getActiveObject() as GroupElement
  if (!activeObject || activeObject.type !== ElementNames.ACTIVE) return
  combineElements()
  canGroup.value = false
  canUnGroup.value = true
}

// 解除组合
const ungroup = () => {
  const [ canvas ] = useCanvas()
  const groupObject = canvas.getActiveObject() as GroupElement
  if (!groupObject || groupObject.type !== ElementNames.GROUP) return
  uncombineElements()
  canUnGroup.value = false
  canGroup.value = true
}

watch(handleElement, () => {
  canGroup.value = false
  canUnGroup.value = false
  if (!handleElement.value) return
  rotate.value = handleElement.value.angle ? handleElement.value.angle : rotate.value
  lock.value = handleElement.value.lockMovementX && handleElement.value.lockMovementX ? true : false
  canGroup.value = handleElement.value.type === ElementNames.ACTIVE
  canUnGroup.value = handleElement.value.type === ElementNames.GROUP
}, {deep: true})

// 置顶
const bringToFront = () => {
  if (!handleElement.value) return
  let objects = currentTemplate.value.objects
  if (handleElement.value.group) {
    objects = handleElement.value.group._objects as CanvasOption[]
  } 
  let oldIndex = 0
  for (let i = 0; i < objects.length; i++) {
    if ((objects[i] as CanvasElement).id === handleElement.value.id) {
      oldIndex = i
    }
  }
  sortElement(objects.length - 1, oldIndex, handleElement.value)
}
// 置底
const sendToBack = () => {
  if (!handleElement.value) return
  let objects = currentTemplate.value.objects
  if (handleElement.value.group) {
    objects = handleElement.value.group._objects as CanvasOption[]
  } 
  let oldIndex = 0
  for (let i = 0; i < objects.length; i++) {
    if ((objects[i] as CanvasElement).id === handleElement.value.id) {
      oldIndex = i
    }
  }
  sortElement(0, oldIndex, handleElement.value)
}
// 上移
const bringForward = () => {
  if (!handleElement.value) return
  forwardElement()
}
// 下移
const sendBackwards = () => {
  if (!handleElement.value) return
  backwardElement()
}

// 左对齐
const leftAlign = () => {
  if (!handleElement.value) return
  const [ canvas ] = useCanvas()
  const { workSpaceDraw } = useCenter()
  if (!workSpaceDraw.left || !workSpaceDraw.width || !handleElement.value.width) return
  handleElement.value.left = workSpaceDraw.left + handleElement.value.width / 2 
}
// 水平居中
const verticallyAlign = () => {
  if (!handleElement.value) return
  const [ canvas ] = useCanvas()
  const { workSpaceDraw } = useCenter()
  if (!workSpaceDraw.left || !workSpaceDraw.width || !handleElement.value.width) return
  handleElement.value.left = workSpaceDraw.getCenterPoint().x
}
// 右对齐
const rightAlign = () => {
  if (!handleElement.value) return
  const [ canvas ] = useCanvas()
  const { workSpaceDraw } = useCenter()
  if (!workSpaceDraw.left || !workSpaceDraw.width || !handleElement.value.width) return
  handleElement.value.left = workSpaceDraw.left + workSpaceDraw.width - handleElement.value.width / 2
}
// 上对齐
const topAlign = () => {
  if (!handleElement.value) return
  const [ canvas ] = useCanvas()
  const { workSpaceDraw } = useCenter()
  if (!workSpaceDraw.top || !workSpaceDraw.height || !handleElement.value.height) return
  handleElement.value.top = workSpaceDraw.top + handleElement.value.height / 2 
}
// 垂直居中
const horizontallyAlign = () => {
  if (!handleElement.value) return
  const [ canvas ] = useCanvas()
  const { workSpaceDraw } = useCenter()
  if (!workSpaceDraw.top || !workSpaceDraw.height || !handleElement.value.height) return
  handleElement.value.top = workSpaceDraw.getCenterPoint().y
}
// 下对齐
const bottomAlign = () => {
  if (!handleElement.value) return
  const [ canvas ] = useCanvas()
  const { workSpaceDraw } = useCenter()
  if (!workSpaceDraw.top || !workSpaceDraw.height || !handleElement.value.height) return
  handleElement.value.top = workSpaceDraw.top + workSpaceDraw.height - handleElement.value.height / 2
}

// 修改旋转
const changeRotate = (value: number) => {
  const [ canvas ] = useCanvas()
  if (!handleElement.value || !canvas) return
  handleElement.value.angle = value
  canvas.renderAll()
  templatesStore.modifedElement()
}

// 修改旋转45度（顺时针或逆时针）
const changeRotate45 = (command: '+' | '-') => {
  const [ canvas ] = useCanvas()
  if (!handleElement.value || !canvas) return
  let _rotate = Math.floor(rotate.value / 45) * 45
  if (command === '+') _rotate = _rotate + 45
  else if (command === '-') _rotate = _rotate - 45
  if (_rotate < -180) _rotate = -180
  if (_rotate > 180) _rotate = 180
  rotate.value = _rotate
  handleElement.value.angle = _rotate
  canvas.renderAll()
  templatesStore.modifedElement()
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