<!--
 * @Author: June
 * @Description: 图片描边
 * @Date: 2024-04-12 21:12:06
 * @LastEditors: June
 * @LastEditTime: 2024-04-14 10:25:55
-->
<template>
   <div class="element-shadow">
    <div class="row">
      <div class="stroke-name">
        <b>启用图片描边
        <el-tooltip
          class="box-item"
          effect="dark"
          content="只支持透明图层"
          placement="top"
        >
          <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>：
        </b>
      </div>
      <div class="stroke-option switch-wrapper">
        <el-switch v-model="openImgStroke" @change="toggleStroke"></el-switch>
      </div>
    </div>
    <template v-if="openImgStroke">
      <div class="row">
        <div class="stroke-color">描边颜色：</div>
        <el-popover trigger="click" width="265">
          <template #reference>
            <ColorButton :color="strokeStyle" style="flex: 3" />
          </template>
          <ColorPicker
            :modelValue="strokeStyle"
            @update:modelValue="(color: string) => updateStrokeColor(color)"
          />
        </el-popover>
      </div>
      <div class="row">
        <div class="stroke-width">描边厚度：</div>
        <el-slider class="slider" v-model="strokeWidth" :min="10" @change="updateImgStroke"></el-slider>
      </div>
      <div class="row">
        <div class="stroke-name">只显示轮廓：</div>
        <el-switch v-model="isStroke" @change="updateImgStroke"></el-switch>
      </div>
    </template>
  </div>
</template>

<script name="ImageStroke" lang="ts" setup>
import { QuestionFilled } from '@element-plus/icons-vue';
import { ref, computed , unref } from "vue";
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import useCanvas from '@/views/Canvas/useCanvas'

const [ canvas ] = useCanvas()
const { canvasObject } = storeToRefs(useMainStore())

const openImgStroke = ref(false);
const isStroke = ref(false)
const handleElement = computed(() => canvasObject.value)
const strokeStyle = ref('#f34250')
const strokeWidth = ref(0)
const updateImgStroke = () => {
  if (!handleElement.value) return
  handleElement.value.set({
    strokes: [{ 
      stroke: unref(strokeStyle), strokeWidth: unref(strokeWidth)
    }]
  })
  const strokeType = unref(isStroke) ? 'destination-out' : 'source-over';
  // @ts-ignore
  handleElement.value.renderStroke(strokeType)
}

const toggleStroke = (val: boolean) => {
  if (!handleElement.value || handleElement.value?.type !== 'image') return
  if (val) {
    strokeStyle.value = '#f34250';
    strokeWidth.value = 10
    updateImgStroke()
  } else {
    strokeStyle.value = '';
    strokeWidth.value = 0
    updateImgStroke()
  }
}
//图片描边颜色更改事件
const updateStrokeColor = (color: string) => {
  strokeStyle.value = color;
  updateImgStroke()
};
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.stroke-name {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-self: center;
}
.stroke-width {
  flex: 2;
  display: flex;
  justify-content: flex-start;
  align-self: center;
}
.stroke-option {
  flex: 1;
}
.switch-wrapper {
  text-align: right;
}
.slider {
  flex: 3;
  width: 80%;
}
</style>