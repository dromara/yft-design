<template>
  <el-dialog v-model="state.dialogVisible" title="AI智能抠图" width="35%" class="matting-dialog" :before-close="closeUpload">
    <el-row class="model-row">
      <el-col :span="2" class="model-tip">模型</el-col>
      <el-col :span="4">
        <el-select v-model="mattingModel">
          <el-option v-for="item in MattingModel" :key="item.key" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-upload v-if="!state.originImage" class="upload-demo" ref="uploadRef" :on-exceed="handleExceed" drag action="http" :http-request="uploadHandle" :limit="1" :accept="state.fileAccept" v-loading="state.loading">
      <el-icon :size="50">
        <UploadFilled />
      </el-icon>
      <div class="el-upload__text">
        拖拽文件到这里 或者 <em>选择文件上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          为了更好的体验，请上传 2M 内的图片
        </div>
      </template>
    </el-upload>
    <div class="content">
      <div v-show="state.originImage" v-loading="!state.resultImage" :style="{ width: state.offsetWidth ? state.offsetWidth + 'px' : '100%' }" class="scan-effect transparent-background">
        <img ref="raw" :style="{ 'clip-path': 'inset(0 0 0 ' + state.percent + '%)' }" :src="state.originImage" alt="原始图像" />
        <img v-show="state.resultImage" :src="state.resultImage" @mousemove="mousemove" alt="结果图像" />
        <div v-show="state.resultImage" :style="{ left: state.percent + '%' }" class="scan-line"></div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-show="state.originImage && state.toolModel" type="danger" @click="clear">清空</el-button>
        <el-button v-show="state.resultImage" type="primary" @click="edit">编辑</el-button>
        <el-button v-show="state.resultImage && state.toolModel" type="success" @click="download">下载</el-button>
        <el-button v-show="state.resultImage && !state.toolModel" v-loading="state.loading" type="primary" > {{ state.loading ? '上传中..' : '完成抠图' }} </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch, reactive } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { getImageDataURL, getImageText, getImageSize } from '@/utils/image'
import { downloadLinkFile } from '@/utils/download'
import { ElMessage, genFileId, UploadInstance, UploadProps, UploadRawFile } from "element-plus"
import { uploadImage } from '@/api/matting'
import { useTemplatesStore } from '@/store'
import { MattingModel } from '@/configs/images'
import useCanvasScale from '@/hooks/useCanvasScale'
import useHandleCreate from '@/hooks/useHandleCreate'
import useHandleTemplate from '@/hooks/useHandleTemplate'
import useCanvas from '@/views/Canvas/useCanvas'

const templatesStore = useTemplatesStore()
const { setCanvasTransform } = useCanvasScale()
const { createImageElement } = useHandleCreate()
const { addTemplate } = useHandleTemplate()

interface TImageMattingState {
  dialogVisible: boolean
  fileAccept: string
  show: boolean
  filename: string
  originImage: string
  resultImage: string
  offsetWidth: number
  percent: number
  progress: number
  progressText: string
  toolModel: boolean
  loading: boolean
}

const state = reactive<TImageMattingState>({
  dialogVisible: false,
  fileAccept: '.jpg,.jpeg,.png,.webp',
  show: false,
  filename: '',
  originImage: '',
  resultImage: '',
  offsetWidth: 0,
  percent: 0,
  progress: 0,
  progressText: '',
  toolModel: true,
  loading: false,
})

const isRuning = ref(false)
const mattingModel = ref<string>(MattingModel[0].key)
const uploadRef = ref<UploadInstance>()
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

watch(() => props.visible, (val) => {
  state.dialogVisible = val
  if (val) {
    uploadRef.value?.clearFiles()
  }
})

const closeUpload = () => {
  emit('close')
}

const uploadHandle = async (option: any) => {
  state.filename = option.file.name
  const fileSuffix = state.filename.split('.').pop()
  if (!state.fileAccept.split(',').includes(`.${fileSuffix}`)) return
  const res = await uploadImage(option.file, fileSuffix)
  const mattingData = res.data
  state.originImage = await getImageDataURL(option.file)
  const { width, height } = await getImageSize(state.originImage)
  if (mattingData.code === 200) {
    state.resultImage = mattingData.resultImage
    // state.offsetWidth = mattingData.size.width
    requestAnimationFrame(run)
  }
}

const handleExceed: UploadProps['onExceed'] = (files: File[]) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}


const clear = () => {
  URL.revokeObjectURL(state.originImage)
  state.originImage = ''
  state.resultImage = ''
  state.percent = 0
  state.offsetWidth = 0
}

const run = () => {
  state.percent += 1
  isRuning.value = true
  state.percent < 100 ? requestAnimationFrame(run) : (isRuning.value = false)
}

const edit = () => {

}

const download = () => {
  if (!state.resultImage) return
  downloadLinkFile(state.resultImage, `yft-design-${Date.now()}-matting-${state.filename}`)
}

const mousemove = (e: MouseEvent) => {
  !isRuning.value && (state.percent = (e.offsetX / (e.target as any).width) * 100)
}

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
  background: rgba(255, 255, 255, 0.7);
  // background-image: linear-gradient(to top, transparent, rgba(255, 255, 255, 0.7), transparent);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

</style>
<style>
.matting-dialog .el-dialog__header {
  text-align: left
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