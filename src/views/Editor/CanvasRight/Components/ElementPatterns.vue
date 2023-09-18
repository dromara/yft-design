<template>
  <div class="element-shadow">
    <div class="row">
      <div style="flex: 2; "><b>启用底纹：</b></div>
      <div class="switch-wrapper" style="flex: 3;">
        <el-switch v-model="openPattern" @change="togglePatterns"></el-switch>
      </div>
    </div>
    <template v-if="openPattern">
      <div class="row">
        <div style="flex: 2;">底纹模式：</div>
        <el-select class="select" v-model="repeatPattern" @change="updatePatternElement">
          <el-option value="repeat" label="拼贴"></el-option>
          <el-option value="repeat-x" label="水平"></el-option>
          <el-option value="repeat-y" label="垂直"></el-option>
        </el-select>
      </div>
      <div class="row">
        <div style="flex: 2;">底纹图片：</div>
        <el-select class="select" v-model="sourcePattern" @change="updatePatternElement">
          <el-option v-for="item in PatternImages" :key="item.name" :value="item.name" :label="item.name"></el-option>
        </el-select>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { util, Pattern } from 'fabric'
import { TextboxElement, TPatternRepeat } from '@/types/canvas'
import { PatternImages } from '@/configs/images'
import useCanvas from '@/views/Canvas/useCanvas'
const [ canvas ] = useCanvas()
const { canvasObject } = storeToRefs(useMainStore())

const handleElement = computed(() => canvasObject.value as TextboxElement)


const repeatPattern = ref<TPatternRepeat>('repeat')
const sourcePattern = ref<string>(PatternImages[0].name)

const hasPattern = computed(() => {
  if (!handleElement.value) return false
  return handleElement.value.fillType === 1
})

const openPattern = ref(hasPattern.value)

const updatePatternElement = async () => {
  const imageURL = PatternImages.filter(item => item.name === sourcePattern.value)[0].url
  if (!imageURL) return
  const imgElement = await util.loadImage(imageURL)
  const workSpacePattern = new Pattern({
    source: imgElement,
    repeat: repeatPattern.value
  })
  handleElement.value.fillRepeat = repeatPattern.value ? repeatPattern.value : 'repeat'
  handleElement.value.fillURL = imageURL
  handleElement.value.fill = workSpacePattern
  handleElement.value.fillType = 1
  canvas.renderAll()
}

const togglePatterns = () => {
  if (!handleElement.value) return
  if (handleElement.value.fillType === 0) {
    handleElement.value.color = handleElement.value.fill as string
    updatePatternElement()
  }
  else {
    handleElement.value.fill = handleElement.value.color
    handleElement.value.fillType = 0
  }
  canvas.renderAll()
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.switch-wrapper {
  text-align: right;
}
.slider {
  flex: 3;
}
.select {
  flex: 3;
}
</style>