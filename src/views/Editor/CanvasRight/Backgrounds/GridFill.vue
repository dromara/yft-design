
<template>
  <el-dialog v-model="dialogVisible" :before-close="closeColor" width="35%" class="self-background">
    <div class="self-main">
      <div class="self-content">
        <canvas ref="gridBackground"></canvas>
      </div>
    </div>
    <div class="self-footer">
      <label class="self-lable">点击方块修改颜色</label>
      <div class="self-color">
        <div class="color-content">
          <div v-for="item in gridColorSelf" :key="item.index" :style="{backgroundColor: item.color}" class="color-item">
            <el-popover trigger="click" width="265">
              <template #reference>
                <div class="color-select"></div>
              </template>
              <ColorPicker :modelValue="item.color" @update:modelValue="(value: string) => updateColor(value, item.index)"/>
            </el-popover>
          </div>
          <el-button class="ml-5" circle @click="addColor" v-if="gridColorSelf.length < 11"><IconPlus/></el-button>
          <el-button class="ml-5" circle @click="subColor" v-if="gridColorSelf.length > 2"><IconMinus/></el-button>
        </div>
      </div>
      <el-button class="btn close" round @click="saveColor()">保存色彩</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import trianglify from '@/plugins/trianglify/trianglify'
import { GridColorSelf } from '@/configs/colorGrid'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})

const gridBackground = ref<null | HTMLCanvasElement>(null)

const dialogVisible = ref(false)
const gridColorSelf = ref(GridColorSelf)

const emit = defineEmits<{
  (event: 'save', payload: string[]): void
  (event: 'close'): void
}>()

watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val) {
    nextTick(() => {
      generateBackground()
    })
  }
})

// const openedDialog = () => {
//   generateBackground()
// }

// 添加自定义色彩
const addColor = () => {
  const gridColor = gridColorSelf.value[gridColorSelf.value.length - 1]
  gridColorSelf.value.push({index: gridColor.index + 1, color: gridColor.color})
  generateBackground()
}

// 删除自定义色彩
const subColor = () => {
  gridColorSelf.value.pop()
  generateBackground()
}

const getGridColor = () => {
  const gridColors: string[] = []
  gridColorSelf.value.forEach(item => {
    gridColors.push(item.color)
  })
  return gridColors
}

const generateBackground = () => {
  const defaultOptions = {
    width: 1200,
    height: 600,
    cellSize: 75,
    variance: 0.75,
    seed: null,
    xColors: getGridColor(),
    yColors: 'match',
    fill: true,
    palette: trianglify.utils.colorbrewer,
    colorSpace: 'lab',
    colorFunction: trianglify.colorFunctions.interpolateLinear(0.5),
    strokeWidth: 0,
    points: null
  }
  const trianglifier = trianglify(defaultOptions)
  trianglifier.toCanvas(gridBackground.value)
}

const updateColor = (color: string, index: number) => {
  gridColorSelf.value[index].color = color
  generateBackground()
}

const saveColor = () => {
  emit('save', getGridColor())
}

const closeColor = () => {
  emit('close')
}

</script>

<style lang="scss" scoped>
.self-main {
  padding: 30px;
  background: #e8e8e8;
}

.self-content {
  margin: 0 auto;
  width: 300px;
}

.self-main canvas {
  max-width: 100%;
  width: 300px;
  max-height: 100%;
  height: 200px;
  object-fit: contain;
  filter: drop-shadow(2px 2px 8px rgba(0, 0, 0, .2));
}

.self-footer {
  padding: 15px 30px;
  margin: 0 auto;
  text-align: center;
}

.self-color {
  margin: 15px 0;
}

.color-content {
  display: inline-flex;
  justify-content: center;
  max-width: calc(100% - 90px);
}

.color-item {
  height: 32px;
  width: 32px;
  flex: 0 1 32px;
  display: inline-block;
  cursor: pointer;
  margin: 0 2px;
  transition: transform .2s ease, box-shadow .2s ease;
}
.ml-5 {
  margin-left: 5px;
}

.color-select {
  width: 32px;
  height: 32px;
}

</style>

<style>

.self-background .el-dialog__body {
  padding: 0;
}

.self-background .el-dialog__header {
  padding: 0;
}

</style>