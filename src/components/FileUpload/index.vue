<template>
  <el-dialog v-model="dialogVisible" title="导入文件" width="35%" class="upload-dialog" :before-close="closeUpload">
    <el-upload class="upload-demo" ref="uploadRef" :on-exceed="handleExceed" drag action="http" :http-request="uploadHandle" :limit="1" :accept="fileAccept" v-loading="uploading">
      <el-icon :size="50">
        <UploadFilled />
      </el-icon>
      <div class="el-upload__text">
        拖拽文件到这里 或者 <em>选择文件上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          支持 PSD / PDF / SVG / CDR 以及 图片 等格式
        </div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { getImageDataURL, getImageText } from '@/utils/image'
import { ElMessage, genFileId, UploadInstance, UploadProps, UploadRawFile } from "element-plus"
import { uploadFile } from '@/api/file'
import { useTemplatesStore } from '@/store'
import { loadSVGFromString } from 'fabric'
import useCanvasScale from '@/hooks/useCanvasScale'
import useHandleCreate from '@/hooks/useHandleCreate'
import useHandleTemplate from '@/hooks/useHandleTemplate'
import useCanvas from '@/views/Canvas/useCanvas'


const templatesStore = useTemplatesStore()
const { setCanvasTransform } = useCanvasScale()
const { createImageElement } = useHandleCreate()
const { addTemplate } = useHandleTemplate()
const dialogVisible = ref(false)
const uploading = ref(false)
const fileAccept = ref('.pdf,.psd,.cdr,.ai,.svg,.jpg,.jpeg,.png,.webp,.json')
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
  dialogVisible.value = val
  if (val) {
    uploadRef.value?.clearFiles()
  }
})

const closeUpload = () => {
  emit('close')
}

const uploadHandle = async (option: any) => {
  const [ canvas ] = useCanvas()
  const filename = option.file.name
  const fileSuffix = filename.split('.').pop()
  if (!fileAccept.value.split(',').includes(`.${fileSuffix}`)) return
  if (fileSuffix === 'svg') {
    const dataText = await getImageText(option.file)
    const content = await loadSVGFromString(dataText)
    canvas.add(...content.objects)
    canvas.renderAll()
    emit('close')
  }
  if (fileSuffix === 'json') {
    const dataText = await getImageText(option.file)
    const template = JSON.parse(dataText)
    addTemplate(template)
    emit('close')
  }
  if (['jpg', 'jpeg', 'png', 'webp'].includes(fileSuffix)) {
    const dataURL = await getImageDataURL(option.file)
    createImageElement(dataURL)
    emit('close')
  }
  uploading.value = true
  const res = await uploadFile(option.file, fileSuffix)
  uploading.value = false
  if (res && res.data.code === 200) {
    const template = res.data.data
    if (!template) return
    await templatesStore.addTemplate(template)
    setCanvasTransform()
    emit('close')
  }
}

const handleExceed: UploadProps['onExceed'] = (files: File[]) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}

</script>

<style lang="scss" scoped>

</style>
<style>
.upload-dialog .el-dialog__header {
  text-align: left
}
.upload-dialog .el-upload__tip {
  text-align: left;
}
.upload-dialog .el-upload-list__item-name {
  padding: 0;
}
.upload-dialog .el-upload-list__item-info {
  width: 100%;
  margin-left: 0;
}
</style>