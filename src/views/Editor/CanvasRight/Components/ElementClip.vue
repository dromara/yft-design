<template>
  <div class="element-clip">
    <div class="row">
      <div style="flex: 2;"><b>启用剪切：</b></div>
      <div class="switch-wrapper" style="flex: 3;">
        <el-switch v-model="hasClippath" @change="toggleStroke()"></el-switch>
      </div>
    </div>
    <template v-if="hasClippath">
      <div class="shape-box">
        <div class="category" v-for="item in PathShapeLibs" :key="item.type">
          <div class="shape-list">
            <div class="shape-item" v-for="(shape, index) in item.children" :key="index">
              <div class="shape-content" @click="selectShape(shape)">
                <svg overflow="visible" width="20" height="20">
                  <g :transform="`scale(${20 / shape.viewBox[0]}, ${20 / shape.viewBox[1]}) translate(0,0) matrix(1,0,0,1,0,0)`">
                    <path 
                      class="shape-path"
                      :class="{ 'outlined': shape.outlined }"
                      vector-effect="non-scaling-stroke" 
                      stroke-linecap="butt" 
                      stroke-miterlimit="8"
                      :fill="shape.outlined ? '#999' : 'transparent'"
                      :stroke="shape.outlined ? 'transparent' : '#999'"
                      stroke-width="2" 
                      :d="shape.path"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { PathShapeLibs } from '@/configs/shape'
import { PathPoolItem } from '@/types/elements'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import { Path } from 'fabric'
import { PathElement } from '@/types/canvas'
import useCanvas from '@/views/Canvas/useCanvas'
const mainStore = useMainStore()
const { canvasObject } = storeToRefs(mainStore)

const handleElement = computed(() => canvasObject.value as PathElement)
const fontColor = ref('#000')
const hasClippath = ref(true)

const toggleStroke = () => {
  
}

const selectShape = (shape: PathPoolItem) => {
  const [ canvas ] = useCanvas()
  const clipPath = new Path(shape.path, {
    left: -handleElement.value.width / 2,
    top: -handleElement.value.height / 2,
  })
  handleElement.value.set({clipPath})
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
.shape-pool {
  width: 100%;
  margin-top: -12px;
  margin-bottom: -12px;
  margin-right: -12px;
  padding-right: 12px;
  padding-top: 12px;
}
.shape-box {
  border: 1px solid $borderColor;
  border-radius: $borderRadius;
  max-height: 200px;
  overflow: auto
}
.shape-list {
  @include flex-grid-layout();
  margin-bottom: 10px;
}
.shape-item {
  @include flex-grid-layout-children(6, 16%);
  height: 0;
  padding-bottom: 16%;
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
}
.shape-content {
  @include absolute-0();

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover .shape-path {
    &:not(.outlined) {
      stroke: $themeColor;
    }
    &.outlined {
      fill: $themeColor;
    }
  }

  svg:not(:root) {
    overflow: visible;
  }
}
</style>