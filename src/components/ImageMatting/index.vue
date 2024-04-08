<template>
  <el-dialog
    v-model="state.dialogVisible"
    :title="t('message.AICutoutImage')"
    width="35%"
    class="matting-dialog"
    :before-close="closeUpload"
    :close-on-click-modal="false"
  >
    <el-row class="model-row">
      <el-col :span="2" class="model-tip">{{ t("message.model") }}</el-col>
      <el-col :span="4">
        <el-select v-model="mattingModel">
          <el-option
            v-for="item in MattingModel"
            :key="item.key"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-upload
      v-if="!state.originImage"
      class="upload-demo"
      ref="uploadRef"
      :on-exceed="handleExceed"
      drag
      action="http"
      :http-request="uploadHandle"
      :limit="1"
      :accept="state.fileAccept"
      v-loading="state.loading"
    >
      <el-icon :size="50">
        <UploadFilled />
      </el-icon>
      <div class="el-upload__text">
        {{ t("message.dragAndDropFiles")
        }}<em>{{ t("message.selectFileUpload") }}</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">{{ t("message.imageLimit2MTips") }}</div>
      </template>
    </el-upload>
    <div class="content">
      <div
        v-show="state.originImage"
        v-loading="!state.resultImage"
        :style="{ width: state.offsetWidth ? state.offsetWidth + 'px' : '100%' }"
        class="scan-effect transparent-background"
      >
        <img
          ref="raw"
          :style="{ 'clip-path': 'inset(0 0 0 ' + state.percent + '%)' }"
          :src="state.originImage"
          :alt="t('message.rawImage')"
        />
        <img
          v-show="state.resultImage"
          :src="state.resultImage"
          @mousemove="mousemove"
          :alt="t('message.resultImage')"
        />
        <div
          v-show="state.resultImage"
          :style="{ left: state.percent + '%' }"
          class="scan-line"
        ></div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          v-show="state.originImage && state.toolModel"
          type="danger"
          @click="clear"
          >{{ t("message.clear") }}</el-button
        >
        <el-button v-show="state.resultImage" type="primary" @click="edit">{{
          t("message.edit")
        }}</el-button>
        <el-button
          v-show="state.resultImage && state.toolModel"
          type="success"
          @click="download"
          >{{ t("message.download") }}</el-button
        >
        <el-button
          v-show="state.resultImage && !state.toolModel"
          v-loading="state.loading"
          type="primary"
        >
          {{
            state.loading
              ? t("message.uploading")
              : t("message.completeImageCutout")
          }}
        </el-button>
        <el-button
          v-show="state.resultImage && props.image"
          v-loading="state.loading"
          type="primary"
          @click="replaceImage"
        >
          替换
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch, reactive } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { getImageDataURL, getImageText, getImageSize } from "@/utils/image";
import { downloadLinkFile } from "@/utils/download";
import {
  ElMessage,
  genFileId,
  UploadInstance,
  UploadProps,
  UploadRawFile,
} from "element-plus";
import { uploadImage, uploadURL } from "@/api/matting";
import { useTemplatesStore } from "@/store";
import { MattingModel } from "@/configs/images";
import { Image } from "fabric";
import useCanvasScale from "@/hooks/useCanvasScale";
import useHandleCreate from "@/hooks/useHandleCreate";
import useHandleTemplate from "@/hooks/useHandleTemplate";
import useCanvas from "@/views/Canvas/useCanvas";
import useI18n from "@/hooks/useI18n";


const { t } = useI18n();
const templatesStore = useTemplatesStore();
const { setCanvasTransform } = useCanvasScale();
const { createImageElement } = useHandleCreate();
const { addTemplate } = useHandleTemplate();

interface TImageMattingState {
  dialogVisible: boolean;
  fileAccept: string;
  show: boolean;
  filename: string;
  originImage: string;
  resultImage: string;
  offsetWidth: number;
  percent: number;
  progress: number;
  progressText: string;
  toolModel: boolean;
  loading: boolean;
}

const state = reactive<TImageMattingState>({
  dialogVisible: false,
  fileAccept: ".jpg,.jpeg,.png,.webp",
  show: false,
  filename: "",
  originImage: "",
  resultImage: "",
  offsetWidth: 0,
  percent: 0,
  progress: 0,
  progressText: "",
  toolModel: true,
  loading: false,
});

const isRuning = ref(false);
const mattingModel = ref<string>(MattingModel[0].key);
const uploadRef = ref<UploadInstance>();
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  imageId: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  
});

const emit = defineEmits<{
  (event: "close"): void;
}>();

watch(
  () => props.visible,
  (val) => {
    state.dialogVisible = val;
    if (val) {
      uploadRef.value?.clearFiles();
      updateElement(props.image)
    }
  }
);

const closeUpload = () => {
  emit("close");
};

const uploadHandle = async (option: any) => {
  state.filename = option.file.name;
  const fileSuffix = state.filename.split(".").pop();
  if (!state.fileAccept.split(",").includes(`.${fileSuffix}`)) return;
  state.originImage = await getImageDataURL(option.file);
  const res = await uploadImage(option.file, fileSuffix);
  const mattingData = res.data;
  const { width, height } = await getImageSize(state.originImage);
  if (mattingData.code === 200) {
    state.resultImage = mattingData.resultImage;
    // state.offsetWidth = mattingData.size.width
    requestAnimationFrame(run);
  }
};

const updateElement = async (image?: string) => {
  if (!image) return
  state.originImage = image;
  const res = await uploadURL(image);
  const mattingData = res.data;
  const { width, height } = await getImageSize(state.originImage);
  if (mattingData.code === 200) {
    state.resultImage = mattingData.resultImage;
    // state.offsetWidth = mattingData.size.width
    requestAnimationFrame(run);
  }
}

const replaceImage = async () => {
  const [ canvas ] = useCanvas()
  const activeObject = canvas.getActiveObject() as Image
  if (!activeObject) return
  await activeObject.setSrc(state.resultImage)
  canvas.renderAll()
  emit('close')
}

const handleExceed: UploadProps["onExceed"] = (files: File[]) => {
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
};

const clear = () => {
  URL.revokeObjectURL(state.originImage);
  state.originImage = "";
  state.resultImage = "";
  state.percent = 0;
  state.offsetWidth = 0;
};

const run = () => {
  state.percent += 1;
  isRuning.value = true;
  state.percent < 100 ? requestAnimationFrame(run) : (isRuning.value = false);
};

const edit = () => {};

const download = () => {
  if (!state.resultImage) return;
  downloadLinkFile(
    state.resultImage,
    `yft-design-${Date.now()}-matting-${state.filename}`
  );
};

const mousemove = (e: MouseEvent) => {
  !isRuning.value && (state.percent = (e.offsetX / (e.target as any).width) * 100);
};
</script>

<style lang="scss" scoped>
.model-row {
  padding-bottom: 10px;
  .model-tip {
    display: flex;
    align-items: center;
  }
}
.content {
  position: relative;
  display: flex;
  justify-content: center;
}
.scan-effect {
  position: relative;
  overflow: hidden;
  height: 50vh;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: absolute;
  }
}
.scan-line {
  position: absolute;
  top: 0;
  width: 1.5px;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  // background-image: linear-gradient(to top, transparent, rgba(255, 255, 255, 0.7), transparent);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}
</style>
<style>
.matting-dialog .el-dialog__header {
  text-align: left;
}
.matting-dialog .el-upload__tip {
  text-align: left;
}
.matting-dialog .el-dialog__body {
  padding-top: 0;
}
.matting-dialog .el-upload-list__item-name {
  padding: 0;
}
.matting-dialog .el-upload-list__item-info {
  width: 100%;
  margin-left: 0;
}
</style>