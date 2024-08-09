<template>
  <el-dialog v-model="dialogVisible" title="" :width="dialogWidth" class="login-dialog" :before-close="closeLogin">
    <el-row>
      <el-row class="text-[20px] text-[#222529] font-semibold leading-snug justify-center">
        {{tipInfo}}登录
      </el-row>
      <el-row class="text-[12px] mt-[10px] justify-center">
        仅用于身份识别，yft-design不会获取您的任何隐私信息~
      </el-row>
      <el-row v-if="loginType === 1">
        <div class="overflow-hidden relative mt-[20px] mx-auto p-[10px] border border-solid border-[rgba(0, 0, 0, .08)] rounded-[8px] justify-center">
          <div class="w-[150px] h-[150px] ">
            <el-image :src="qrcode" v-loading="!qrcode" class="w-full h-full"></el-image>
          </div>
        </div>
      </el-row>
      <el-row v-if="loginType === 2">
        <el-row class="h-[172px] mx-auto mt-[20px] login-form">
          <el-form
            ref="formRef"
            style="max-width: 800px"
            label-width="auto"
            class="demo-dynamic"
          >
            <el-form-item>
              <el-input type="username" autocomplete="off" :prefix-icon="User"/>
            </el-form-item>
            <el-form-item>
              <el-input type="password" autocomplete="off" :prefix-icon="Lock"/>
            </el-form-item>
            <el-form-item>
              <el-input type="password" autocomplete="off" :prefix-icon="Lock"/>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row class="mx-auto">
          <el-button>登陆</el-button>
        </el-row>
      </el-row>
      <el-row class="mt-[28px] justify-center">
        <div class="w-[170px] h-[45px]">
          <el-row class="h-full">
            <el-col :span="8" class="flex justify-center">
              <el-button class="h-full" @click="loginGithub"><IconGithub class="text-[20px]" /></el-button>
            </el-col>
            <el-col :span="8" class="flex justify-center">
              <el-button class="h-full" @click="loginQQ"><IconTencentQq class="text-[20px]" /></el-button>
            </el-col>
            <el-col :span="8" class="flex justify-center">
              <el-button class="h-full" @click="loginEmail"><IconMail class="text-[20px]" /></el-button>
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
import { oauthWechat, oauthTokenGithub } from '@/api/oauth'
import { UserResult } from '@/api/oauth/types'
import { isMobile } from '@/utils/common'
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store';
import { localStorage } from '@/utils/storage';
import { Lock, User } from '@element-plus/icons-vue'
const dialogWidth = computed(() => isMobile() ? '75%' : '35%')
const qrcode = ref('')
const dialogVisible = ref(false)
const loginType = ref(1)
const tipInfo = ref('微信')
const { loginStatus, username } = storeToRefs(useUserStore())
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'close', payload: boolean): void
}>()

watch(() => props.visible, (val) => {
  dialogVisible.value = val
})

const closeLogin = () => {
  emit('close', false)
  qrcode.value = ''
}

const getOauthWechat = async () => {
  const result = await oauthWechat()
  if (result.data.code === 200) {
    qrcode.value = result.data.data.img
  }
}

const loginGithub = async () => {
  const res = await oauthTokenGithub()
  if (res.data && res.data.code === 200) {
    const oauthWindow = window.open(res.data.data, '_blank', 'width=600,height=400,menubar=no,toolbar=no,location=no')
    window.addEventListener('message', (event: any) => {
      if (event.origin === window.location.origin) {
        loginStatus.value = true
        const userResult = event.data as UserResult
        localStorage.set('access_token', userResult.access_token)
        username.value = userResult.user.username
        oauthWindow?.close()
        emit('close', false)
      }
    });
  }
}

const loginQQ = () => {
  loginType.value = 1
  tipInfo.value = '微信'
}

const loginEmail = () => {
  loginType.value = 2
  tipInfo.value = '邮箱'
}

</script>

<style lang="scss" scoped>
.h-full {
  height: 100%;
}
.login-form {
  align-items: center
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