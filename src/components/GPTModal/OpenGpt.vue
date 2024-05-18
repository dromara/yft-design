<!--
 * @Author: June 1601745371@qq.com
 * @Date: 2024-05-18 14:34:26
 * @LastEditors: June 1601745371@qq.com
 * @LastEditTime: 2024-05-18 15:28:58
 * @FilePath: \yft-design\src\components\GPTModal\OpenGpt.vue
 * @Description: 开通GPT弹窗
-->
<template>
   <el-dialog v-model="dialogVisible" :width="500" :title="$t('gpt.openGPTTitle')"  class="upload-dialog"  :before-close="handleClose" :close-on-click-modal="false">
    <div>
      <div class="mb-[20px] text-center">初级变中级，中级变高级，让前端开发更轻松高效!</div>
      <div class="mb-[20px] text-center">限时优惠，数量有限，先到先得!</div>
      <div class="cursor-pointer text-center text-[18px] font-bold" @click="handleCopy">
        <div>
          <IconCopyOne />点击复制<IconWechat />微信号 <el-tag>juezhanqianye_</el-tag> 
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">{{ $t('default.cancel') }}</el-button>
        <el-button type="primary" @click="handleClose">
          {{ $t('default.ok') }}
        </el-button>
      </div>
    </template>
   </el-dialog>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { copyText } from '@/utils/clipboard'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['close'])
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})
const dialogVisible = ref(false)

const handleClose = debounce(function() {
  dialogVisible.value = false
  emits('close')
}, 250)

const handleCopy = debounce(async function() {
  const result = await copyText('juezhanqianye_')
  result && ElMessage.success('复制成功')
}, 250)

watch(() => props.visible, (val) => {
  dialogVisible.value = val
})

</script>