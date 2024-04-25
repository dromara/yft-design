<template>
  <el-dialog v-model="dialogVisible" :width="432" :title="$t('message.ColorFillImage')" width="35%" class="upload-dialog" :before-close="closeUpload" :close-on-click-modal="false">
    <el-upload v-if="showUpload" class="upload-demo" ref="uploadRef" :on-exceed="handleExceed" drag action="http" :http-request="uploadHandle" :limit="1" :accept="fileAccept" v-loading="uploading">
      <el-icon :size="50">
        <UploadFilled />
      </el-icon>
      <div class="el-upload__text">
        拖拽图片到这里 或者 <em>选择图片上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          支持图片格式
        </div>
      </template>
    </el-upload>
    <div  v-else>
      <el-popover trigger="click" :width="265">
        <template #reference>
          <ColorButton :color="targetColor" />
        </template>
        <ColorPicker :modelValue="targetColor" @update:modelValue="(color:string) =>updateTargetColor(color)" />
      </el-popover>
    <canvas id="ImageFillColor" class="mt-10px"></canvas>
    </div>
        <template #footer>
      <div class="dialog-footer">
        <el-button
          v-show="!showUpload && dataURL"
          type="danger"
          @click="clear"
          >{{ t("message.clear") }}</el-button
        >
        <el-button
          v-show="!showUpload && dataURL"
          type="success"
          @click="download"
          >{{ t("message.download") }}</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch, nextTick } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { getImageDataURL, getImageText } from '@/utils/image'
import { ElMessage, genFileId, UploadInstance, UploadProps, UploadRawFile } from "element-plus"
import { uploadFile } from '@/api/file'
import { useTemplatesStore } from '@/store'
import useCanvasScale from '@/hooks/useCanvasScale'
import useHandleCreate from '@/hooks/useHandleCreate'
import useHandleTemplate from '@/hooks/useHandleTemplate'
import useCanvas from '@/views/Canvas/useCanvas'
import useI18n from "@/hooks/useI18n";
import tinycolor from 'tinycolor2'
import { downloadLinkFile } from "@/utils/download";

const { t } = useI18n();
const templatesStore = useTemplatesStore()
const { setCanvasTransform } = useCanvasScale()
const { createImageElement, createVideoElement } = useHandleCreate()
const { addTemplate } = useHandleTemplate()
const dialogVisible = ref(false)
const uploading = ref(false)
const showUpload = ref(true)
const fileAccept = ref('.jpg,.jpeg,.png,.webp,')
const uploadRef = ref<UploadInstance>()
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})
const canvasWidth = ref(400)
const dataURL: ImageData = ref('')
const targetColor = ref('#ffffff')

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
  if (['jpg', 'jpeg', 'png', 'webp'].includes(fileSuffix)) {
    dataURL.value = await getImageDataURL(option.file)
    showUpload.value = false
    nextTick(() => {
      initCanvas()
    })
  }
}

const clear = () => {
  dataURL.value = ''
  showUpload.value = true
};

const updateTargetColor = (color: string) => {
  targetColor.value = tinycolor(color).toHexString();
}

const handleExceed: UploadProps['onExceed'] = (files: File[]) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}
let cvs: HTMLCanvasElement | null = null
const initCanvas = () => {
  cvs = document.getElementById('ImageFillColor') as HTMLCanvasElement
  const ctx = cvs.getContext('2d', {
    willReadFrequently: true,
  })
  const img = new Image();
  // let originalImageData: ImageData;
  img.src = dataURL.value;
  img.onload = () => {
    const maxWH = Math.max(img.width, img.height);
    const imgScale = canvasWidth.value / maxWH;
      cvs.width = img.width * imgScale;
      cvs.height = img.height * imgScale;
      // 绘制图像
      ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
      // 在加载图像后保存原始图像数据
      dataURL.value = ctx.getImageData(0, 0, cvs.width, cvs.height);
  }
  cvs.addEventListener('click', e=>{
        console.log(e)
        const x = e.offsetX;
        const y = e.offsetY;
        if (!dataURL.value) {
            console.error("原始图像数据未初始化！");
            return;
        }
         // 恢复原始图像数据
        ctx.putImageData(dataURL.value, 0, 0);
        // 取出点击位置的像素点颜色
        const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);
        const clickColor = getColor(x, y, imgData);
        const targetColorRgba = tinycolor(targetColor.value).toRgb();
        const targetColorArr = [targetColorRgba.r, targetColorRgba.g, targetColorRgba.b, 255];

        const stack = [{ x, y }];
        while (stack.length > 0) {
            const { x, y } = stack.pop();
            
            if (x < 0 || x >= cvs.width || y < 0 || y >= cvs.height) {
                continue;
            }
            
            const i = point2Index(x, y);
            const color = getColor(x, y, imgData);
            
            if (diff(color, clickColor) <= 100 && diff(color, targetColorArr) !== 0) {
                imgData.data.set(targetColorArr, i);
                
                stack.push({ x: x + 1, y });
                stack.push({ x: x - 1, y });
                stack.push({ x, y: y + 1 });
                stack.push({ x, y: y - 1 });
            }
        }
        ctx.putImageData(imgData, 0, 0);
        dataURL.value =imgData
        
    })
}

const point2Index = (x, y) =>{
    return ( y * cvs.width + x ) * 4;
}
const getColor = (x, y, imageData) =>{
    const i = point2Index(x, y);
    return [
        imageData.data[i],
        imageData.data[i+1],
        imageData.data[i+2],
        imageData.data[i+3],
    ];
}
const diff = (color1, color2) =>{
    const res = Math.abs(color1[0] - color2[0]) +
        Math.abs(color1[1] - color2[1]) + 
        Math.abs(color1[2] - color2[2]) + 
        Math.abs(color1[3] - color2[3]);
    return res;
}

const download = () => {
  if (!dataURL.value) return;
  const canvas = document.getElementById('ImageFillColor'); // 替换为你的canvas元素的id
  downloadLinkFile(
    canvas.toDataURL('image/png'),
    `yft-design-${Date.now()}-ImageFillColor.png`
  );
};

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