<template>
  <div>
    <el-row class="layout-search">
      <el-input :prefix-icon="Search" placeholder="搜索工具"></el-input>
    </el-row>
    <el-row>
      <div class="code-common" @click="createBarElement">
        <div class="code-icon">
          <IconPayCodeTwo class="icon-font"/>
        </div>
        <div class="code-text">
          <div class="font-middle">条形码</div>
          <div class="font-little">快速生成一维码,支持4种码制</div>
        </div>
      </div>
    </el-row>
    <el-row>
      <div class="code-common" @click="createQRElement('A1')">
        <div class="code-icon">
          <IconTwoDimensionalCodeTwo class="icon-font"/>
        </div>
        <div class="code-text">
          <div class="font-middle">二维码</div>
          <div class="font-little">快速生成二维码,支持13种样式</div>
        </div>
      </div>
    </el-row>
    <el-row>
      <div class="code-common" @click="openUpload">
        <div class="code-icon">
          <IconMagicWand class="icon-font"/>
        </div>
        <div class="code-text">
          <div class="font-middle">AI抠图</div>
          <div class="font-little">运用AI技术，实现智能识别</div>
        </div>
      </div>
    </el-row>
    <ImageMatting :visible="dialogVisible" @close="closeUpload"/>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Base64 } from 'js-base64'
import { Search } from '@element-plus/icons-vue'

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
  CodeOption
} from 'beautify-qrcode'

import { QRCodeType } from '@/types/canvas'
import JsBarCode from 'jsbarcode'
import useHandleCreate from '@/hooks/useHandleCreate'
import useI18n from '@/hooks/useI18n'

const { t } = useI18n()
const { createQRCodeElement, createBarCodeElement } = useHandleCreate()
const codeContent = ref<string>(window.location.href)
const codeSpace = ref<boolean>(true)
const codeError = ref<number>(0)
const dialogVisible = ref(false)
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

// 获取qrcode
const getEncodeData = (width = 118, height = 118) => {
  const codeOption: CodeOption = {
    text: codeContent.value,
    width,
    height,
    correctLevel: codeError.value,
    isSpace: codeSpace.value
  }
  return encodeData(codeOption)
}

const createBarElement = () => {
  const codeOption: JsBarCode.BaseOptions = {
    format: "pharmacode",
    lineColor: "#0aa",
    width: 4,
    height: 40,
    displayValue: false
  }
  JsBarCode('#barcode', '1234', codeOption)
  const barcode = document.getElementById('barcode')
  if (!barcode) return
  const s = new XMLSerializer().serializeToString(barcode)
  const src = `data:image/svg+xml;base64,` + Base64.encode(s)
  createBarCodeElement(src, '1234', codeOption)
}

const createQRElement = (style: QRCodeType) => {
  const src = `data:image/svg+xml;base64,` + Base64.encode(generateQRCodeMap[style](getEncodeData(118, 118)))
  const codeOption = {
    codeStyle: style,
    codeSpace: codeSpace.value,
    codeError: codeError.value,
  }
  createQRCodeElement(src, codeOption, codeContent.value)
}

const openUpload = () => {
  dialogVisible.value = true
}

const closeUpload = () => {
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.layout-search {
  margin: 0 auto;
  width: 68%;
  padding: 20px 10px 10px;
}
.code-common {
  width: 100%;
  height: 80px;
  border: 1px solid $borderColor;
  border-radius: 5px;
  margin: 0 20px 20px 20px;
  background: #f6f6f6;
  display: flex;
  cursor: pointer;
}
.code-icon {
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.code-text {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.font-middle {
  font-size: 12px;
  font-weight: 500;
  color: #31363f;
  line-height: 12px;
  margin: 5px 0;
}
.font-little {
  font-size: 12px;
  font-weight: 400;
  color: #31363f;
  line-height: 12px;
  margin: 5px 0;
}
.icon-font {
  font-size: 20px;
}
</style>