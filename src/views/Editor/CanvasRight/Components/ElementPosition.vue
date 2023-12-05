<template>
  <div class="element-position">
    <div class="mb-10">
      <el-row>
        <el-tooltip placement="top" :hide-after="0" content="左对齐">
          <el-col :span="4" class="align-item" @click="alignElement(AlignCommand.LEFT)">
            <IconAlignLeft/>
          </el-col>
        </el-tooltip>
        <el-tooltip placement="top" :hide-after="0" content="水平居中">
          <el-col :span="4" class="align-item" @click="alignElement(AlignCommand.HORIZONTAL)">
            <IconAlignVertically/>
          </el-col>
        </el-tooltip>
        <el-tooltip placement="top" :hide-after="0" content="右对齐">
          <el-col :span="4" class="align-item" @click="alignElement(AlignCommand.RIGHT)">
            <IconAlignRight/>
          </el-col>
        </el-tooltip>
        <el-tooltip placement="top" :hide-after="0" content="上对齐">
          <el-col :span="4" class="align-item" @click="alignElement(AlignCommand.TOP)">
            <IconAlignTop/>
          </el-col>
        </el-tooltip>
        <el-tooltip placement="top" :hide-after="0" content="垂直居中">
          <el-col :span="4" class="align-item" @click="alignElement(AlignCommand.VERTICAL)">
            <IconAlignHorizontally/>
          </el-col>
        </el-tooltip>
        <el-tooltip placement="top" :hide-after="0" content="下对齐">
          <el-col :span="4" class="align-item" @click="alignElement(AlignCommand.BOTTOM)">
            <IconAlignBottom/>
          </el-col>
        </el-tooltip>
      </el-row>
    </div>
    <div class="mb-10">
      <el-row>
        <el-col :span="11" class="position-col">
          <SwipeInput v-bind="left" content='X'/>
        </el-col>
        <el-col :span="2" class="fixed-ratio">
          <el-tooltip effect="dark"  placement="top" content="解除宽高比" v-if="isFixed">
            <IconLock class="icon-btn" @click="changeFixedRatio(false)"/>
          </el-tooltip>
          <el-tooltip effect="dark" placement="top" content="锁定宽高比" v-else>
            <IconUnlock class="icon-btn" @click="changeFixedRatio(true)"/>
          </el-tooltip>
        </el-col>
        <el-col :span="11" class="position-col">
          <SwipeInput v-bind="top" content='Y'/>
        </el-col>
      </el-row>
    </div>
    <div class="mb-10">
      <el-row>
        <el-col :span="11" class="position-col">
          <SwipeInput v-bind="width" content='W'/>
        </el-col>
        <el-col :span="2" class="fixed-ratio">
          <el-tooltip effect="dark"  placement="top" content="解除宽高比" v-if="isFixed">
            <IconLock class="icon-btn" @click="changeFixedRatio(false)"/>
          </el-tooltip>
          <el-tooltip effect="dark" placement="top" content="锁定宽高比" v-else>
            <IconUnlock class="icon-btn" @click="changeFixedRatio(true)"/>
          </el-tooltip>
        </el-col>
        <el-col :span="11" class="position-col">
          <SwipeInput v-bind="height" content='H'/>
        </el-col>
      </el-row>
    </div>
    <div class="mb-10">
      <el-row>
        <el-col :span="11" class="position-col">
          <SwipeInput v-bind="angle" content='A'/>
        </el-col>
        <el-col :span="2" class="fixed-ratio">
        </el-col>
        <el-col :span="5" class="angle-col">
          <div @click="changeRotate45('-')">
            <IconRotate/> -45°
          </div>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="5" class="angle-col">
          <div @click="changeRotate45('+')">
            <IconRotate :style="{ transform: 'rotateY(180deg)' }"/> +45°
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-row>
        <el-tooltip placement="top" :hide-after="0" content="置顶">
          <el-col :span="6" class="align-item" @click="layerElement(LayerCommand.TOP)">
            <IconSendToBack/>
          </el-col>
        </el-tooltip>
        <el-tooltip placement="top" :hide-after="0" content="置底">
          <el-col :span="6" class="align-item" @click="layerElement(LayerCommand.BOTTOM)">
            <IconBringToFrontOne/>
          </el-col>
        </el-tooltip>
        <el-tooltip placement="top" :hide-after="0" content="下移">
          <el-col :span="6" class="align-item" @click="layerElement(LayerCommand.DOWN)">
            <IconSendBackward/>
          </el-col>
        </el-tooltip>
        <el-tooltip placement="top" :hide-after="0" content="上移">
          <el-col :span="6" class="align-item" @click="layerElement(LayerCommand.UP)">
            <IconBringForward/>
          </el-col>
        </el-tooltip>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { AlignCommand, LayerCommand } from '@/types/elements'
import { useMainStore, useTemplatesStore } from '@/store'
import useCanvas from '@/views/Canvas/useCanvas'
import useHandleTool from '@/hooks/useHandleTool'
import useHandleActive from '@/hooks/useHandleActive'

const templatesStore = useTemplatesStore()
const { alignElement, layerElement } = useHandleTool()
const [ canvas ] = useCanvas()
const { canvasObject } = storeToRefs(useMainStore())
const { handleActive } = useHandleActive()
const left = handleActive('left')
const top = handleActive('top')
const height = handleActive('height')
const width = handleActive('width')
const angle = handleActive('angle')
// const handleElement = computed(() => canvasObject.value as CanvasElement)
// const { x, y } = getWidthHeight(canvas.activeObject.value as FabricObject)
const isFixed = ref(false)


const changeFixedRatio = (status: boolean) => {
  isFixed.value = status
}

// 修改旋转45度（顺时针或逆时针）
const changeRotate45 = (command: '+' | '-') => {
  const [ canvas ] = useCanvas()
  if (!canvasObject.value || !canvas) return
  let _rotate = Math.floor(canvasObject.value.angle / 45) * 45
  if (command === '+') _rotate = _rotate + 45
  else if (command === '-') _rotate = _rotate - 45
  if (_rotate < -180) _rotate = -180
  if (_rotate > 180) _rotate = 180
  canvasObject.value.angle = _rotate
  canvas.renderAll()
  templatesStore.modifedElement()
}


</script>

<style lang="scss" scoped>
.align-item {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: $borderRadius;
  &:hover{
    background-color: #f1f1f1;
  }
}
.mb-10 {
  margin-bottom: 10px;
}
.fixed-ratio {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.position-col {
  :deep(.el-input-number) {
    width: auto
  }
}
.position-col {
  .swipe-input {
    position: relative;
    &::after {
      width: 25px;
      content: attr(content);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: var(--el-input-number-unit-offset-x);
      color: #999999;
    }
  }
}
.angle-col {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: $borderRadius;
  &:hover{
    background-color: #f1f1f1;
  }
}
</style>

<style scoped>
:deep(.el-input .el-input-group__prepend) {
  padding: 0 5px;
  width: 7px;
}
:deep(.el-input .el-input-group__append) {
  padding: 0 5px;
}
:deep(.full-ratio .el-radio-button__inner) {
  width: 100%;
}
</style>