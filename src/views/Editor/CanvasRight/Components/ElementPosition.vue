<template>
  <div class="element-position">
    <div class="mb-10"><b>元素坐标</b></div>
    <div class="mb-10">
      <el-row>
        <el-col :span="11">
          <SwipeInput v-bind="left" :label="'x'"/>
        </el-col>
        <el-col :span="2" class="fixed-ratio">
          <!-- <el-tooltip effect="dark"  placement="top" content="解除宽高比" v-if="isFixed">
            <IconLock class="icon-btn" @click="changeFixedRatio(false)"/>
          </el-tooltip>
          <el-tooltip effect="dark" placement="top" content="锁定宽高比" v-else>
            <IconUnlock class="icon-btn" @click="changeFixedRatio(true)"/>
          </el-tooltip> -->
        </el-col>
        <el-col :span="11">
          <SwipeInput v-bind="top" :label="'y'"/>
        </el-col>
      </el-row>
    </div>
    <div class="mb-10">
      <el-row>
        <el-col :span="11">
          <SwipeInput v-bind="width" :label="'w'"/>
        </el-col>
        <el-col :span="2" class="fixed-ratio">
          <el-tooltip effect="dark"  placement="top" content="解除宽高比" v-if="isFixed">
            <IconLock class="icon-btn" @click="changeFixedRatio(false)"/>
          </el-tooltip>
          <el-tooltip effect="dark" placement="top" content="锁定宽高比" v-else>
            <IconUnlock class="icon-btn" @click="changeFixedRatio(true)"/>
          </el-tooltip>
        </el-col>
        <el-col :span="11">
          <SwipeInput v-bind="height" :label="'h'"/>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { CanvasElement } from '@/types/canvas'
import useHandleActive from '@/hooks/useHandleActive'
import useCanvas from '@/views/Canvas/useCanvas'

const [ canvas ] = useCanvas()
const { canvasObject } = storeToRefs(useMainStore())
const { handleActive } = useHandleActive()

const handleElement = computed(() => canvasObject.value as CanvasElement)
const left = handleActive('left')
const top = handleActive('top')
const width = handleActive('width')
const height = handleActive('height')

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