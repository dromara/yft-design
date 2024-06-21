<template>
  <div class="oauth-container">
    
  </div>
</template>


<script setup lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { oauthCallbackGithub } from "@/api/oauth";
import { useUserStore } from '@/store';

const getQueryParams = (name: string) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  }
  return null;
}

const router = useRouter();
const userStore = useUserStore()


const oauthCallback = async (code: string) => {
  const res = await oauthCallbackGithub({code})
  console.log('res.data.user:', res.data)
  if (res.data && res.data.data) {
    userStore.isLogin = true
    const { href } = router.resolve({path: '/home'})
    window.open(href, '_blank')
  }
}

onMounted(() => {
  const code = getQueryParams('code')
  if (!code) return
  oauthCallback(code)
})

</script>

<style lang="scss" scoped>
</style>
