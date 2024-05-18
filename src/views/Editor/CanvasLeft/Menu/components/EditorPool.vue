<template>
  <div class="edit-pool">
    <div class="edit-section pt-20px">
      <div class="font-bold text-lg mb-6px">{{ $t('message.files') }}</div>
      <el-row :gutter="10" class="mt-10">
        <el-col :span="8">
          <el-upload ref="uploadRef" :on-exceed="handleExceed" action="http" :http-request="uploadHandle" :limit="1" :accept="fileAccept" v-loading="uploading" class="edit-upload">
            <div class="item-box">
              <IconUpload class="icon-font" />
              <div class="mt-8px">{{ $t('message.uploadFiles') }}</div>
            </div>
          </el-upload>
        </el-col>
      </el-row>
    </div>
    <div class="edit-section">
      <div class="font-bold text-lg mb-6px">{{ $t('message.text') }}</div>
      <el-row :gutter="10" class="mt-10">
        <el-col :span="8">
          <div class="item-box" @click="drawText(80)">
            <IconH1 class="icon-font" />
            <div class="mt-5px">{{ $t('message.title') }}</div>
          </div>
        </el-col>
        <el-col :span="8" @click="drawText(60)">
          <div class="item-box">
            <IconH3 class="icon-font" />
            <div class="mt-5px">{{ $t('message.subtitle') }}</div>
          </div>
        </el-col>
        <el-col :span="8" @click="drawText(36)">
          <div class="item-box">
            <IconTextRotationNone class="icon-font" />
            <div class="mt-5px">{{ $t('message.horizontalText') }}</div>
          </div>
        </el-col>
        <el-col :span="8" @click="drawVerticalText(36)">
          <div class="item-box">
            <IconTextRotationDown class="icon-font" />
            <div class="mt-5px">{{ $t('message.verticalText') }}</div>
          </div>
        </el-col>
        <el-col :span="8" @click="drawText(36, undefined, true)">
          <div class="item-box">
            <IconText class="icon-font" />
            <div class="mt-5px">{{ $t('message.hollowOutText') }}</div>
          </div>
        </el-col>
        <el-col :span="8" @click="drawArcText">
          <div class="item-box">
            <i class="icon-font iconfont icon-text-path" />
            <div class="mt-5px">{{ $t('message.circularText') }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="edit-section">
      <div class="font-bold text-lg mb-6px">{{ $t('message.shape') }}</div>
      <el-row :gutter="10" class="mt-10">
        <el-col :span="8" v-for="(shape, index) in PathShapeLibs" :key="index" @click="drawPath(shape)">
          <div class="item-box">
            <svg overflow="visible" width="20" height="20">
              <g :transform="`scale(${20 / shape.viewBox[0]}, ${20 / shape.viewBox[1]}) translate(0,0) matrix(1,0,0,1,0,0)`">
                <path class="shape-path" :class="{ outlined: shape.outlined }" vector-effect="non-scaling-stroke" stroke-linecap="butt" stroke-miterlimit="8" :fill="shape.outlined ? '#999' : 'transparent'" :stroke="shape.outlined ? 'transparent' : '#999'" stroke-width="2" :d="shape.path"></path>
              </g>
            </svg>
          </div>
        </el-col>
        <el-col :span="8" v-for="(line, j) in LinePoolItems" :key="j" @click="drawLine(line)">
          <div class="item-box">
            <svg overflow="visible" width="20" height="20">
              <defs>
                <LinePointMarker class="line-marker" v-if="line.points[0]" :id="`preset-line-${j}`" position="start" :type="line.points[0]" color="currentColor" :baseSize="2" />
                <LinePointMarker class="line-marker" v-if="line.points[1]" :id="`preset-line-${j}`" position="end" :type="line.points[1]" color="currentColor" :baseSize="2" />
              </defs>
              <path
                class="line-path"
                :d="line.path"
                stroke="#999"
                fill="none"
                stroke-width="2"
                :stroke-dasharray="line.style === 'solid' ? '0, 0' : '4, 1'"
                :marker-start="line.points[0] ? `url(#${`preset-line-${j}`}-${line.points[0]}-start)` : ''"
                :marker-end="line.points[1] ? `url(#${`preset-line-${j}`}-${line.points[1]}-end)` : ''"
              ></path>
            </svg>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="edit-section">
      <div class="font-bold text-lg mb-6px">{{ $t('message.module') }}</div>
      <el-row :gutter="10" class="mt-10">
        <!-- 添加表格 -->
        <el-col :span="8">
          <div class="item-box" @click="drawTable">
            <IconInsertTable class="icon-font" />
            <div class="mt-5px">{{ $t("message.fabricTable") }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="item-box" @click="createBarElement">
            <IconPayCodeTwo class="icon-font" />
            <div class="mt-5px">{{ $t("message.barCode") }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="item-box" @click="createQRElement('A1')">
            <IconTwoDimensionalCodeTwo class="icon-font" />
            <div class="mt-5px">{{ $t("message.QRCode") }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="item-box" @click="openUpload">
            <IconMagicWand class="icon-font" />
            <div class="mt-5px">{{ $t("message.AICutoutImage") }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <ImageMatting :visible="dialogVisible" @close="closeUpload" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Base64 } from "js-base64";
import { Search } from "@element-plus/icons-vue";
import { ShapePathFormulasKeys, PathListItem } from "@/types/elements";
import { ElMessage, genFileId, UploadInstance, UploadProps, UploadRawFile } from "element-plus"
import { encodeData, renderer25D, rendererRect, rendererRound, rendererRandRound, rendererDSJ, rendererRandRect, rendererImage, rendererCircle, rendererLine, rendererLine2, rendererFuncA, rendererFuncB, CodeOption } from "beautify-qrcode";
import { PathPoolItem } from '@/types/elements'
import { QRCodeType, Template } from "@/types/canvas";
import { getImageDataURL, getImageText } from "@/utils/image";
import { LinePoolItems, LinePoolItem } from "@/configs/lines";
import { Object as FabricObject } from 'fabric'
import { loadSVGFromString } from '@/extension/parser/loadSVGFromString'
import { uploadFile } from '@/api/file'
import useCanvasScale from '@/hooks/useCanvasScale'
import useHandleCreate from '@/hooks/useHandleCreate'
import useHandleTemplate from '@/hooks/useHandleTemplate'
import JsBarCode from "jsbarcode";
import useI18n from "@/hooks/useI18n";
import useCanvas from "@/views/Canvas/useCanvas";

const { t } = useI18n();
const { addTemplate } = useHandleTemplate()
const { setCanvasTransform } = useCanvasScale()
const { 
  createQRCodeElement, 
  createBarCodeElement, 
  createImageElement, 
  createTextElement, 
  createPathElement, 
  createLineElement, 
  createArcTextElement, 
  createVerticalTextElement, 
  createVideoElement,
  createTableElement
} = useHandleCreate();
const codeContent = ref<string>(window.location.href);
const codeSpace = ref<boolean>(true);
const codeError = ref<number>(0);
const uploadRef = ref<UploadInstance>()
const dialogVisible = ref(false);
const generateQRCodeMap = {
  A1: rendererRect,
  A2: rendererRound,
  A3: rendererRandRound,
  SP1: rendererDSJ,
  SP2: rendererRandRect,
  SP3: rendererCircle,
  B1: renderer25D,
  C1: rendererImage,
  A_a1: rendererLine,
  A_a2: rendererLine2,
  A_b1: rendererFuncA,
  A_b2: rendererFuncB,
};
const fileAccept = ref(".pdf,.psd,.cdr,.ai,.svg,.jpg,.jpeg,.png,.webp,.json,.mp4");
const uploading = ref(false);
const PathShapeLibs: PathPoolItem[] = [
  {
    viewBox: [200, 200],
    path: "M 0 0 L 200 0 L 200 200 L 0 200 Z",
  },
  {
    viewBox: [200, 200],
    path: "M 100 0 L 0 200 L 200 200 L 100 0 Z",
    pathFormula: ShapePathFormulasKeys.TRIANGLE,
  },
  {
    viewBox: [200, 200],
    path: "M 100 0 A 50 50 0 1 1 100 200 A 50 50 0 1 1 100 0 Z",
  },
];

// 获取qrcode
const getEncodeData = (width = 118, height = 118) => {
  const codeOption: CodeOption = {
    text: codeContent.value,
    width,
    height,
    correctLevel: codeError.value,
    isSpace: codeSpace.value,
  };
  return encodeData(codeOption);
};

const createBarElement = () => {
  const codeOption: JsBarCode.BaseOptions = {
    format: "pharmacode",
    lineColor: "#0aa",
    width: 4,
    height: 40,
    displayValue: false,
  };
  JsBarCode("#barcode", "1234", codeOption);
  const barcode = document.getElementById("barcode");
  if (!barcode) return;
  const s = new XMLSerializer().serializeToString(barcode);
  const src = `data:image/svg+xml;base64,` + Base64.encode(s);
  createBarCodeElement(src, "1234", codeOption);
};

const createQRElement = (style: QRCodeType) => {
  const src = `data:image/svg+xml;base64,` + Base64.encode(generateQRCodeMap[style](getEncodeData(118, 118)));
  const codeOption = {
    codeStyle: style,
    codeSpace: codeSpace.value,
    codeError: codeError.value,
  };
  createQRCodeElement(src, codeOption, codeContent.value);
};

const openUpload = () => {
  dialogVisible.value = true;
};

const closeUpload = () => {
  dialogVisible.value = false;
};

// 上传文件
const uploadHandle = async (option: any) => {
  const [canvas] = useCanvas();
  const filename = option.file.name;
  const fileSuffix = filename.split(".").pop();
  if (!fileAccept.value.split(",").includes(`.${fileSuffix}`)) return;
  if (fileSuffix === "svg") {
    const dataText = await getImageText(option.file);
    const content = await loadSVGFromString(dataText);
    canvas.add(...content.objects as any);
    canvas.renderAll();
  }
  if (fileSuffix === "json") {
    const dataText = await getImageText(option.file);
    const template = JSON.parse(dataText);
    addTemplate(template);
  }
  if (["jpg", "jpeg", "png", "webp"].includes(fileSuffix)) {
    const dataURL = await getImageDataURL(option.file);
    createImageElement(dataURL);
  }
  if (['mp4'].includes(fileSuffix)) {
    const dataURL = URL.createObjectURL(option.file)
    createVideoElement(dataURL)
  }
  //   uploading.value = true
  const res = await uploadFile(option.file, fileSuffix);
  uploading.value = false;
  if (res && res.data.code === 200) {
    const template = res.data.data as Template;
    if (!template) return;
    await addTemplate(template);
    setCanvasTransform();
  }
};

const handleExceed: UploadProps["onExceed"] = (files: File[]) => {
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
};

// 添加标题文字
const drawText = (fontSize: number, textStyle: "transverse" | "direction" = "transverse", textHollow = false) => {
  createTextElement(fontSize, textStyle, textHollow);
};

// 添加环形文字
const drawArcText = () => {
  createArcTextElement(36)
}

const drawVerticalText = (fontSize: number) => {
  createVerticalTextElement(fontSize)
}

// 添加形状
const drawPath = (shape: PathPoolItem) => {
  createPathElement(shape.path);
};

// 添加线条
const drawLine = (line: LinePoolItem) => {
  const strokeDashArray: [number, number] | undefined = line.style === "dashed" ? [6, 6] : undefined;
  createLineElement(line.data, line.points[0], line.points[1], strokeDashArray);
};

// 添加表格
const drawTable = () => {
  console.log("==>")
  createTableElement();
}
</script>

<style lang="scss" scoped>
.edit-pool {
  overflow: scroll;
}
.mt-10 {
  margin-top: 10px;
}
.edit-section {
  width: 90%;
  margin: 0px 20px 0px 20px;
  .item-box {
    background-color: #f6f6f6;
    border-radius: 5px;
    padding: 15px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    flex-direction: column;
    font-size: 12px;
    margin-bottom: 10px;
    &:hover {
      background-color: #e8eaec;
    }
  }
}
.mt-5px {
  margin-top: 5px;
}
.edit-upload {
  .item-box {
    width: 100%;
  }
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
  height: 20px;
}
:deep(.edit-upload .el-upload) {
  width: 100%;
}
</style>