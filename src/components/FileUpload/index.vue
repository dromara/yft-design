<template>
  <el-dialog v-model="dialogVisible" title="导入文件" width="35%" class="upload-dialog" :before-close="closeUpload">
    <el-upload class="upload-demo" drag action="http" :http-request="uploadHandle" :limit="1" accept=".pdf, .psd, .cdr, .svg, .jpg, .jpeg, .png">
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
import { storeToRefs } from 'pinia'
import { uploadFile } from '@/api/file'
const dialogVisible = ref(false)

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
})

const closeUpload = () => {
  emit('close')
}

const uploadHandle = async (option: any) => {
  await uploadFile(option.file, 'pdf')
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
</style>