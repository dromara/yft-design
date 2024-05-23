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
import { loadSVGFromString } from '@/extension/parser/loadSVGFromString'
import { ElementNames } from '@/types/elements'
import { WorkSpaceDrawData, propertiesToInclude } from '@/configs/canvas'
import { Image, Object as FabricObject } from 'fabric'
import { Template } from "@/types/canvas"
import { nanoid } from 'nanoid'
import useCanvasScale from '@/hooks/useCanvasScale'
import useHandleCreate from '@/hooks/useHandleCreate'
import useHandleTemplate from '@/hooks/useHandleTemplate'
import useCanvas from '@/views/Canvas/useCanvas'
import usePixi from '@/views/Canvas/usePixi';


const templatesStore = useTemplatesStore()
const { setCanvasTransform } = useCanvasScale()
const { createImageElement, createVideoElement } = useHandleCreate()
const { addTemplate } = useHandleTemplate()
const dialogVisible = ref(false)
const uploading = ref(false)
const fileAccept = ref('.pdf,.psd,.cdr,.ai,.svg,.jpg,.jpeg,.png,.webp,.json,.mp4')
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

const generateSVGTemplate = async (dataText: string) => {
  const content = await loadSVGFromString(dataText)
  const options = content.options
  const svgData: any[] = []
  content.objects.slice(0, 1000).forEach(ele => svgData.push((ele as FabricObject).toObject(propertiesToInclude)))
  WorkSpaceDrawData.width = options.width
  WorkSpaceDrawData.height = options.height
  const emptyTemplate: Template = {
    id: nanoid(10),
    version: '6.12',
    zoom: 1,
    width: options.width,
    height: options.height,
    clip: 2,
    objects: [WorkSpaceDrawData, ...svgData],
    workSpace: {
      fillType: 0,
      left: 0,
      top: 0,
      angle: 0,
      scaleX: 1,
      scaleY: 1,
    }
  }
  return emptyTemplate
}

const uploadHandle = async (option: any) => {
  const [ canvas ] = useCanvas()
  const filename = option.file.name
  const fileSuffix = filename.split('.').pop()
  if (!fileAccept.value.split(',').includes(`.${fileSuffix}`)) return
  if (fileSuffix === 'svg') {
    const dataText = await getImageText(option.file)
    const emptyTemplate = await generateSVGTemplate(dataText)
    await templatesStore.addTemplate(emptyTemplate)
    // await templatesStore.renderTemplate()
    setCanvasTransform()
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
  if (['mp4'].includes(fileSuffix)) {
    const dataURL = URL.createObjectURL(option.file)
    createVideoElement(dataURL)
    emit('close')
  }
  uploading.value = true
  const res = await uploadFile(option.file, fileSuffix)
  uploading.value = false
  if (res && res.data.code === 200) {
    const template = res.data.data
    if (!template) return
    if (['pdf', 'ai'].includes(fileSuffix)) {
      const parseTemplate: Template[] = []
      const pdfTemplate = template as any[]
      for (let i = 0; i < pdfTemplate.length; i++) {
        const dataText = pdfTemplate[i]
        const emptyTemplate = await generateSVGTemplate(dataText)
        parseTemplate.push(emptyTemplate)
      }
      
      await templatesStore.addTemplate(parseTemplate)
      setCanvasTransform()
      emit('close')
      return
    }
    await templatesStore.addTemplate(template)
    setCanvasTransform()
    emit('close')
  }
}

const setImageMask = (image: Image) => {
  if (!image.mask) return
  const [ pixi ] = usePixi()
  pixi.postMessage({
    id: image.id,
    type: "mask", 
    src: image.getSrc(),
    mask: JSON.stringify(image.mask), 
    width: image.width, 
    height: image.height
  });
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