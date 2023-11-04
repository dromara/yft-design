<template>
  <div class="image-style-panel">
    <ElementPosition/>
    <el-divider />
    <div class="title">码制：</div>
    <el-select class="full-row mb-10" v-model="handleElement.codeOption.format" @change="generateBarCode">
      <el-option v-for="item in BarCodeStyleLibs" :key="item.index" :value="item.name"></el-option>
    </el-select>
    <div class="title">码值：</div>
    <div class="row">
      <el-input v-model="handleElement.codeContent" @change="generateBarCode"></el-input>
    </div>
    <el-row>
      <el-col :span="11">
        <div class="title">条宽：</div>
        <div class="row">
          <el-input v-model="handleElement.codeOption.width" @change="generateBarCode"></el-input>
        </div>
      </el-col>
      <el-col :span="2"></el-col>
      <el-col :span="11">
        <div class="title">码高：</div>
        <div class="row">
          <el-input v-model="handleElement.codeOption.height" @change="generateBarCode"></el-input>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="11">
        <div class="title">背景颜色：</div>
        <div class="row">
          <el-popover trigger="click" width="265">
            <template #reference>
              <ColorButton :color="handleElement.codeOption.background || '#000'" style="flex: 3;" />
            </template>
            <ColorPicker :modelValue="handleElement.codeOption.background" @update:modelValue="(value: string) => updateBackgroundColor(value)"/>
          </el-popover>
        </div>
      </el-col>
      <el-col :span="2"></el-col>
      <el-col :span="11">
        <div class="title">条码颜色：</div>
        <div class="row">
          <el-popover trigger="click" width="265">
            <template #reference>
              <ColorButton :color="handleElement.codeOption.lineColor || '#000'" style="flex: 3;" />
            </template>
            <ColorPicker :modelValue="handleElement.codeOption.lineColor" @update:modelValue="(value: string) => updateLineColor(value)"/>
          </el-popover>
        </div>
      </el-col>
    </el-row>
    <el-divider />
    <ElementOutline />
    <el-divider />
    <ElementShadow />
    <el-divider />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useTemplatesStore } from '@/store'
import { BarCodeStyleLibs } from '@/configs/codeStyles'
import { Base64 } from 'js-base64'
import { BarCodeElement } from '@/types/canvas'
import JsBarCode from 'jsbarcode'
import useCanvas from '@/views/Canvas/useCanvas'
import ElementPosition from '../Components/ElementPosition.vue'
import ElementOutline from '../Components/ElementOutline.vue'
import ElementShadow from '../Components/ElementShadow.vue'
// const carousel = ref<HTMLFormElement>()
const QRSize = ref(118)
const mainStore = useMainStore()
const templatesStore = useTemplatesStore()
const [ canvas ] = useCanvas()
const { canvasObject } = storeToRefs(mainStore)



const handleElement = computed(() => canvasObject.value as BarCodeElement)

onMounted(() => {
  if (!handleElement.value) return
  // const codeItem = CodeStyleLibs.filter(item => item.name === handleElement.value.codeStyle)[0]
  // if (codeItem.index) {
  //   carousel.value?.setActiveItem(codeItem.index)
  // }
})

// 更新背景颜色
const updateBackgroundColor = (color: string) => {
  generateBarCode()
}

// 更新条码颜色
const updateLineColor = (color: string) => {
  generateBarCode()
}


// 输入二位码内容
const updateCodeContent = () => {
  generateBarCode()
}

// 修改码边距
const updateCodeSpace = () => {
  generateBarCode()
}

// 修改容错率
const updateCodeError = () => {
  generateBarCode()
}

const generateBarCode = async () => {
  JsBarCode('#barcode', handleElement.value.codeContent, handleElement.value.codeOption)
  const barcode = document.getElementById('barcode')
  if (!barcode) return
  const src = `data:image/svg+xml;base64,` + Base64.encode(new XMLSerializer().serializeToString(barcode))
  await handleElement.value.setSrc(src)
  templatesStore.modifedElement()
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
.mb-10 {
  margin-bottom: 10px;
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
.full-row {
  flex: 1;
  width: 100%;
}
.full-ratio {
  display: flex;
  flex: 1;
  .el-radio-button {
    position: relative;
    display: inline-flex;
    outline: 0;
  }
  .el-radio-button__inner {
    width: 100%
  }
}
</style>

<style scoped>
:deep(.full-ratio .el-radio-button__inner) {
  width: 100%;
}
:deep(.full-ratio .el-radio-button) {
  position: relative;
  display: inline-flex;
  outline: 0;
  flex: 1;
  width: 25%
}
.el-carousel__item {
  border-radius: 10px;
}
.el-carousel__item div {
  color: #475669;
  opacity: 0.75;
  line-height: var(--QRSize) + 'px';
  margin: 0;
  text-align: center;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>