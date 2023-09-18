<template>
  <div class="image-style-panel">

    <div class="row">
      <InputNumber
        prefix="水平:"
        :step="0.1"
        :value="left"
        @change="value => updateLeft(value as number)"
        style="flex: 4;"
      />
      <div style="flex: 1;"></div>
      <InputNumber
        prefix="垂直:"
        :step="0.1"
        :value="top"
        @change="value => updateTop(value as number)"
        style="flex: 4;"
      />
    </div>

    <template v-if="handleElement!.type !== 'line'">
      <div class="row">
        <InputNumber
          prefix="宽度:"
          :min="minSize"
          :max="15000"
          :step="0.1"
          :disabled="isVerticalText"
          :value="width"
          @change="value => updateWidth(value as number)"
          style="flex: 4;"
        />
        <template v-if="['image', 'shape', 'code', 'svg'].includes(handleElement!.type)">
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="解除宽高比" v-if="fixedRatio">
            <IconLock style="flex: 1;" class="icon-btn" @click="updateFixedRatio(false)" />
          </Tooltip>
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="锁定宽高比" v-else>
            <IconUnlock style="flex: 1;" class="icon-btn" @click="updateFixedRatio(true)" />
          </Tooltip>
        </template>
        <div style="flex: 1;" v-else></div>
        <InputNumber 
          prefix="高度:"
          :min="minSize"
          :max="8000"
          :step="0.1"
          :disabled="isHorizontalText || handleElement!.type === 'table'" 
          :value="height" 
          @change="value => updateHeight(value as number)"
          style="flex: 4;"
        />
      </div>
    </template>

    <template v-if="!['line', 'video', 'audio'].includes(handleElement!.type)">
      <Divider />

      <div class="row">
        <InputNumber 
          prefix="旋转："
          :min="-180"
          :max="180"
          :step="1"
          :value="rotate" 
          @change="value => updateRotate(value as number)" 
          style="flex: 8;" 
        />
        <div style="flex: 1;"></div>
        <div class="text-btn" @click="updateRotate45('-')" style="flex: 5;"><IconRotate /> -45°</div>
        <div class="text-btn" @click="updateRotate45('+')"  style="flex: 5;"><IconRotate :style="{ transform: 'rotateY(180deg)' }" /> +45°</div>
      </div>
    </template>
    <Divider />
    <ElementOutline />
    <Divider />
    <ElementShadow />
    <Divider />
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { round } from 'lodash'
import { useMainStore, useSlidesStore } from '@/store'
import { Element as SVGElement, SVG } from '@svgdotjs/svg.js'
import { PPTSvgElement, PPTElement } from '@/types/slides'
import { handleSVGChildren } from '@/utils/svg2Element'
import useCreateElement from '@/hooks/useCreateElement'
import { MIN_SIZE } from '@/configs/element'
import ElementOutline from '../common/ElementOutline.vue'
import ElementShadow from '../common/ElementShadow.vue'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { handleElement, handleElementId } = storeToRefs(mainStore)
const { currentSlide } = storeToRefs(slidesStore)

const clipPanelVisible = ref(false)

const handleSvgElement = handleElement as Ref<PPTSvgElement>
const svgContent = document.getElementById(handleSvgElement.value.svgid)?.children[0]
const svgElement = SVG(svgContent)
const SVGContents = ref<SVGElement[]>([])
const slidesElements = ref<PPTElement[]>([])
const SVGContentIDS = ref<string[]>([])
const svgElementChildrens = svgElement?.children()

const left = ref(0)
const top = ref(0)
const width = ref(0)
const height = ref(0)
const rotate = ref(0)
const fixedRatio = ref(false)

const minSize = computed(() => {
  if (!handleElement.value) return 0
  return MIN_SIZE[handleElement.value.type] || 0
})

const isHorizontalText = computed(() => {
  return handleElement.value?.type === 'text' && !handleElement.value.vertical
})
const isVerticalText = computed(() => {
  return handleElement.value?.type === 'text' && handleElement.value.vertical
})

// watch(handleElement, () => {
//   if (!handleElement.value) return

//   left.value = handleElement.value.left
//   top.value = handleElement.value.top

//   fixedRatio.value = 'fixedRatio' in handleElement.value && !!handleElement.value.fixedRatio

//   if (handleElement.value.type !== 'line') {
//     width.value = handleElement.value.width
//     height.value = handleElement.value.height
//     rotate.value = 'rotate' in handleElement.value && handleElement.value.rotate !== undefined ? round(handleElement.value.rotate, 1) : 0
//   }
// }, { deep: true, immediate: true })


// 设置元素位置
const updateLeft = (value: number) => {
  const props = { left: value }
  ({ id: handleElementId.value, props })
  
}
const updateTop = (value: number) => {
  const props = { top: value }
  ({ id: handleElementId.value, props })
  
}
// 设置元素宽度
const updateWidth = (value: number) => {
  const props = { width: value }
  // const shapePathData = updateShapePathData(value, height.value)
  // if (shapePathData) props = { ...props, ...shapePathData }

  ({ id: handleElementId.value, props })
  
}
// 设置元素高度
const updateHeight = (value: number) => {
  const props = { height: value }
  // const shapePathData = updateShapePathData(width.value, value)
  // if (shapePathData) props = { ...props, ...shapePathData }

  ({ id: handleElementId.value, props })
  
}
// 设置元素旋转角度
const updateRotate = (value: number) => {
  const props = { rotate: value }
  ({ id: handleElementId.value, props })
  
}

// 固定元素的宽高比
const updateFixedRatio = (value: boolean) => {
  const props = { fixedRatio: value }
  ({ id: handleElementId.value, props })
  
}

// 将元素旋转45度（顺时针或逆时针）
const updateRotate45 = (command: '+' | '-') => {
  let _rotate = Math.floor(rotate.value / 45) * 45
  if (command === '+') _rotate = _rotate + 45
  else if (command === '-') _rotate = _rotate - 45

  if (_rotate < -180) _rotate = -180
  if (_rotate > 180) _rotate = 180

  const props = { rotate: _rotate }
  ({ id: handleElementId.value, props })
  
}

const handleSelectElement = (element: SVGElement, event: Event) => {
  const nodeName = element.node.nodeName
  // if (nodeName === 'text') {
  //   console.log('attr():', element.attr(), 'textContent:', element.node.textContent, element.bbox())
  //   // const bbox = element.bbox()
  //   // createTextElement({
  //   //   left: bbox.x,
  //   //   top: Math.abs(bbox.y),
  //   //   width: bbox.width,
  //   //   height: bbox.height,
  //   // }, { content: `<p>${element.node.textContent}</p>` })
  // } 
  event.stopPropagation()
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
.origin-image {
  height: 100px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: $lightGray;
  margin-bottom: 10px;
}
.full-width-btn {
  width: 100%;
  margin-bottom: 10px;
}
.btn-icon {
  margin-right: 3px;
}

.clip {
  width: 260px;
  font-size: 12px;

  .title {
    margin-bottom: 5px;
  }
}

.title {
  margin-bottom: 10px;
}
.shape-clip {
  margin-bottom: 10px;

  @include flex-grid-layout();
}
.shape-clip-item {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  @include flex-grid-layout-children(5, 16%);

  &:hover .shape {
    background-color: #ccc;
  }

  .shape {
    width: 40px;
    height: 40px;
    background-color: #e1e1e1;
  }
}

.config-margin {
  display: flex;
  flex: 1;
}
</style>