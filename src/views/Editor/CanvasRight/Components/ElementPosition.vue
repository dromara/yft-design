<template>
  <div class="element-position">
    <div class="mb-10">
      <el-row>
        <el-col :span="11" class="position-col">
          <SwipeInput v-bind="left" content='X'/>
        </el-col>
        <el-col :span="2" class="fixed-ratio">
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
          <!-- <el-tooltip effect="dark"  placement="top" content="解除宽高比" v-if="isFixed">
            <IconLock class="icon-btn" @click="changeFixedRatio(false)"/>
          </el-tooltip>
          <el-tooltip effect="dark" placement="top" content="锁定宽高比" v-else>
            <IconUnlock class="icon-btn" @click="changeFixedRatio(true)"/>
          </el-tooltip> -->
        </el-col>
        <el-col :span="5" class="angle-col">
          <IconRotate/> -45°
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="5" class="angle-col">
          <IconRotate :style="{ transform: 'rotateY(180deg)' }"/> +45°
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { CanvasElement } from '@/types/canvas'
import { getWidthHeight } from '@/app/fabricControls'
import { Object as FabricObject } from 'fabric'
import useCanvas from '@/views/Canvas/useCanvas'
import useHandleActive from '@/hooks/useHandleActive'

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

</script>

<style lang="scss" scoped>
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