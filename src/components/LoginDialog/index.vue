<template>
  <el-dialog v-model="dialogVisible" title="" width="35%" class="login-dialog" :before-close="closeUpload">
    <el-row>
      <el-row class="text-[20px] text-[#222529] font-semibold leading-snug justify-center">
        微信扫码一键登录
      </el-row>
      <el-row class="text-[12px] mt-[10px] justify-center">
        仅用于身份识别，yft-design不会获取您的任何隐私信息~
      </el-row>
      <el-row>
        <div class="overflow-hidden relative mt-[20px] mx-auto p-[10px] border border-solid border-[rgba(0, 0, 0, .08)] rounded-[8px] justify-center">
          <div class="w-[150px] h-[150px] ">
            <el-image :src="qrcode" v-loading="!qrcode" class="w-full h-full"></el-image>
          </div>
        </div>
      </el-row>
      <el-row class="mt-[28px] justify-center">
        <div class="w-[170px] h-[45px]">
          <el-row class="h-full">
            <el-col :span="8" class="flex justify-center">
              <el-button class="h-full"><IconGithub class="text-[20px]" /></el-button>
            </el-col>
            <el-col :span="8" class="flex justify-center">
              <el-button class="h-full"><IconTencentQq class="text-[20px]" /></el-button>
            </el-col>
            <el-col :span="8" class="flex justify-center">
              <el-button class="h-full"><IconMail class="text-[20px]" /></el-button>
            </el-col>
          </el-row>
        </div>
      </el-row>
    </el-row>
    <template #footer>
      <el-row class="justify-center text-[12px] text-[#9da3ac]">
        登录即代表您同意《<strong><a href="" class="hover:text-blue-700">用户服务协议</a></strong>》
      </el-row>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { oauthWechat } from '@/api/oauth'

const qrcode = ref('')
const dialogVisible = ref(false)

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'close', payload: boolean): void
}>()

watch(() => props.visible, async (val) => {
  dialogVisible.value = val
  if (val) {
    await getOauthWechat()
  }
})

const closeUpload = () => {
  emit('close', false)
  qrcode.value = ''
}

const getOauthWechat = async () => {
  const result = await oauthWechat()
  if (result.data.code === 200) {
    qrcode.value = result.data.data.img
  }
}

const setImageMask = () => {
  
}

</script>

<style lang="scss" scoped>
.h-full {
  height: 100%;
}
</style>
<style>
.login-dialog .el-dialog__header {
  text-align: left
}
.login-dialog .el-upload__tip {
  text-align: left;
}
.login-dialog .el-upload-list__item-name {
  padding: 0;
}
.login-dialog .el-upload-list__item-info {
  width: 100%;
  margin-left: 0;
}
</style>