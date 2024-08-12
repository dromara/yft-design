<template>
  <el-dialog v-model="dialogVisible" title="" :width="dialogWidth" class="login-dialog" :before-close="closeLogin">
    <el-row>
      <el-row class="text-[20px] text-[#222529] font-semibold leading-snug justify-center">
        {{loginInfo}}登录
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
        <el-row class="h-[172px] mx-auto mt-[20px] content-center">
          <el-form ref="loginFormRef" :model="ruleForm" :rules="rules" label-width="auto">
            <el-form-item prop="username">
              <el-input type="username" autocomplete="off" :prefix-icon="User" v-model="ruleForm.username" />
            </el-form-item>
            <el-form-item>
              <el-input type="password" autocomplete="off" :prefix-icon="Lock" v-model="ruleForm.password" show-password />
            </el-form-item>
            <el-form-item>
              <el-input style="width: 100px;" v-model="ruleForm.captcha"/>
              <div class="w-[100px] h-full outline-box" @click="getOauthCaptcha">
                <img :src="loginCaptchaImage" alt="" v-loading="loginCaptchaLoading">
              </div>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row class="content-center">
          <el-button class="w-[200px]" type="primary" @click="loginHandle">登陆</el-button>
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
import { OauthLoginData } from '@/api/oauth/types';
import { oauthCaptcha, oauthLogin } from '@/api/oauth';
import type { FormRules } from 'element-plus'

const dialogVisible = ref(false)
const dialogWidth = computed(() => isMobile() ? '75%' : '35%')
const qrcode = ref('')
const loginType = ref(2)
const loginInfo = ref('普通')
const loginCaptchaImage = ref('')
const loginCaptchaLoading = ref(false)
const { loginStatus, username } = storeToRefs(useUserStore())
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})

const ruleForm = reactive<OauthLoginData>({
  username: '',
  password: '',
  captcha: '',
})

const rules = reactive<FormRules<OauthLoginData>>({
  username: [
    {
      required: true,
      message: '请输入用户名或者邮箱地址',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
  captcha: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur',
    },
  ],
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

const getOauthCaptcha = async () => {
  loginCaptchaLoading.value = true
  const result = await oauthCaptcha()
  if (result.data.code === 200) {
    loginCaptchaImage.value = 'data:image/png;base64,' + result.data.data.image
    loginCaptchaLoading.value = false
  }
}

const loginHandle = async () => {
  const result = await oauthLogin(ruleForm)
  console.log('result:', result)
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
  loginInfo.value = '微信'
}

const loginEmail = () => {
  loginType.value = 2
  loginInfo.value = '普通'
  getOauthCaptcha()
}

onMounted(() => {
  getOauthCaptcha()
})

</script>

<style lang="scss" scoped>
.h-full {
  height: 100%;
}
.content-center {
  justify-content: center
}
.outline-box {
  cursor: pointer;
  &:hover {
    outline: 1px solid $borderColor;
  }
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
.login-form .el-input {
  width: 200px;
}
</style>