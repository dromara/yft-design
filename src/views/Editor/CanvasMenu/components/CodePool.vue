<template>
  <div class="layout-pool">
    <el-row class="layout-search">
      <el-input></el-input>
    </el-row>
    <div class="code-content">
      <div class="title">码样式：</div>
      <el-carousel type="card" height="135px" :autoplay="false" trigger="click" indicator-position="none">
        <el-carousel-item v-for="item in QRCodeStyleLibs" :key="item">
          <div justify="center" @click="createElement(item.name as QRCodeType)">
            <img v-if="item.name !== 'C2'" :src="`data:image/svg+xml;base64,` + Base64.encode(generateQRCodeMap[item.name as QRCodeType](getEncodeData()))" :alt="item.name">
            <img v-else :src="c2QRURL" alt="">
          </div>
        </el-carousel-item>
      </el-carousel>
      <div class="title">码内容：</div>
      <div class="row">
        <el-input v-model="codeContent" @change="updateCodeContent"></el-input>
      </div>
      <div class="title">码边距：</div>
      <div class="row">
        <el-radio-group class="full-ratio" v-model="codeSpace" @change="updateCodeSpace">
          <el-radio-button :value="true" :label="true">无边距</el-radio-button>
          <el-radio-button :value="false" :label="false">标准边距</el-radio-button>
        </el-radio-group>
      </div>
      <div class="title">容错率：</div>
      <div class="row">
        <el-radio-group class="full-ratio" v-model="codeError" @change="updateCodeError">
          <el-radio-button :label="0">7%</el-radio-button>
          <el-radio-button :label="1">15%</el-radio-button>
          <el-radio-button :label="2">25%</el-radio-button>
          <el-radio-button :label="3">30%</el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Base64 } from 'js-base64'
import { QRCodeType } from '@/types/canvas'
import { QRCodeStyleLibs } from '@/configs/codeStyles'
import { 
  encodeData,
  renderer25D,
  rendererRect,
  rendererRound,
  rendererRandRound,
  rendererDSJ,
  rendererRandRect,
  rendererImage,
  rendererCircle,
  rendererLine,
  rendererLine2,
  rendererFuncA,
  rendererFuncB,
} from 'beautify-qrcode'
import useHandleCreate from '@/hooks/useHandleCreate'

const { createQRCodeElement } = useHandleCreate()
const codeContent = ref<string>(window.location.href)
const codeSpace = ref<boolean>(true)
const codeError = ref<number>(0)
const c2QRURL = ref<string>('')

const generateQRCodeMap = {
  'A1': rendererRect,
  'A2': rendererRound,
  'A3': rendererRandRound,
  'SP1': rendererDSJ,
  'SP2': rendererRandRect,
  'SP3': rendererCircle,
  'B1': renderer25D,
  'C1': rendererImage,
  'A_a1': rendererLine,
  'A_a2': rendererLine2,
  'A_b1': rendererFuncA,
  'A_b2': rendererFuncB,
}

// 输入二位码内容
const updateCodeContent = () => {
  getEncodeData()
}

// 修改码边距
const updateCodeSpace = () => {
  getEncodeData()
}

// 修改容错率
const updateCodeError = () => {
  getEncodeData()
}

// 获取qrcode
const getEncodeData = (width = 135, height = 135) => {
  const codeOption = {
    text: codeContent.value,
    width,
    height,
    correctLevel: codeError.value,
    isSpace: codeSpace.value
  }
  return encodeData(codeOption)
}

const createElement = (style: QRCodeType) => {
  const src = `data:image/svg+xml;base64,` + Base64.encode(generateQRCodeMap[style](getEncodeData(50, 50)))
  const codeOption = {
    codeStyle: style,
    codeSpace: codeSpace.value,
    codeError: codeError.value,
  }
  createQRCodeElement(src, codeOption, codeContent.value)
}
</script>

<style lang="scss" scoped>
.layout-search {
  margin: 0 auto;
  width: 68%;
  padding: 20px 10px 10px;
}
.code-content {
  width: 90%;
  margin: 0 auto;
}
.code-style {
  display: flex;
  position: relative;
  box-sizing: border-box;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  overflow-x: auto;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.code-item {
  width: 100px;
  height: 100px;
  margin-top: 10px;
  background: pink;
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
.layout-templates {
  display: flex;
  flex-wrap: wrap;
  padding: 2px;
  .thumbnail {
    display: flex;
    width: 124px;
    margin: 2px;
  }
  .thumbnail img {
    outline: 1px solid $borderColor;
    margin: 0 5px;
    cursor: pointer;
    &:hover {
      outline-color: $themeColor;
    }
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
  line-height: 135px;
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