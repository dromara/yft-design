<template>
  <div class="element-position">
    <div class="mb-10"><b>元素坐标</b></div>
    <div class="mb-10">
      <el-row>
        <el-col :span="11">
          <el-input v-model="elementLeft" :value="(Math.round(elementLeft * 100/100))" @change="changeElementWidth" oninput="value=value.replace(/[^\d]/g,'')">
            <template #prepend>x</template>
          </el-input>
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
          <el-input v-model="elementTop" :value="(Math.round(elementTop * 100/100))" @change="changeElementHeight" oninput="value=value.replace(/[^\d]/g,'')">
            <template #prepend>y</template>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="mb-10">
      <el-row>
        <el-col :span="11">
          <el-input v-model="elementWidth" :value="(Math.round(elementWidth * 100/100))" @change="changeElementWidth" oninput="value=value.replace(/[^\d]/g,'')">
            <template #prepend>w</template>
          </el-input>
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
          <el-input v-model="elementHeight" :value="(Math.round(elementHeight * 100/100))" @change="changeElementHeight" oninput="value=value.replace(/[^\d]/g,'')">
            <template #prepend>h</template>
          </el-input>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { CanvasElement } from '@/types/canvas'
import useCanvas from '@/views/Canvas/useCanvas'


const [ canvas ] = useCanvas()
const { canvasObject } = storeToRefs(useMainStore())


const handleElement = computed(() => canvasObject.value as CanvasElement)
const elementLeft = ref(handleElement.value.left)
const elementTop = ref(handleElement.value.top)
const elementWidth = ref(handleElement.value.width)
const elementHeight = ref(handleElement.value.height)
const isFixed = ref(false)

watch(elementLeft, () => {
  console.log('canvasObject.value', canvasObject.value)
})

const changeFixedRatio = (status: boolean) => {
  isFixed.value = status
}

const changeElementWidth = (val: number) => {
  elementWidth.value = val
}

const changeElementHeight = (val: number) => {
  elementWidth.value = val
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