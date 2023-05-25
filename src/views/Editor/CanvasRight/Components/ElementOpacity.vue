<template>
  <div class="element-opacity">
    <el-row>
      <el-col :span="7" class="slider-name"><b>不透明度：</b></el-col>
      <el-col :span="13">
        <el-slider class="slider" v-model="opacity" :min="0" :max="1" :step="0.01" @change="updateOpacity"></el-slider>
      </el-col>
      <el-col :span="4" class="slider-num">{{ opacity }}</el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import useCanvas from '@/views/Canvas/useCanvas'
const { canvasObject } = storeToRefs(useMainStore())

const opacity = ref<number>(canvasObject.value ? canvasObject.value.opacity : 1)

const updateOpacity = () => {
  const [ canvas ] = useCanvas()
  if (!canvasObject.value) return
  canvasObject.value.opacity = opacity.value
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
.slider {
  flex: 3;
}
.slider-name {
  display: flex;
  align-items: center;
}
.slider-num{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>