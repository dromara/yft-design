<template>
  <el-config-provider :locale="locale.el">
    <Computer v-if="!isMobile()" />
    <Mobile v-else />
  </el-config-provider>
</template>

<script lang="ts" setup>

import Computer from '@/views/Editor/computer.vue'
import Mobile from '@/views/Editor/mobile.vue'
import useI18n from '@/hooks/useI18n'
import { isMobile } from '@/utils/common'
import { useRouter } from 'vue-router'
import { getTemplateInfo } from '@/api/template'
import { useTemplatesStore } from '@/store'
import { unzip } from "@/utils/crypto"
import { ElMessage } from 'element-plus'

const { messages }= useI18n()
const router = useRouter()
const templatesStore = useTemplatesStore()
const locale = computed(() => messages.value)

const getTemplateDetail = async (pk: number) => {
  const result = await getTemplateInfo(pk)
  if (result.data && result.data.code === 200 && result.data.data) {
    try {
      const templateData = unzip(result.data.data.data)
      const data = JSON.parse(templateData)
      console.log('data:', data)
      await templatesStore.changeTemplate(data)
    } 
    catch (error) {
      console.log('error:', error)
      ElMessage({
        type: 'error',
        message: '模板加载失败,请联系管理员修改bug了',
      })
    }
  }
}

onMounted(async () => {
  console.log('router:', router.currentRoute.value.query)
  const query = router.currentRoute.value.query
  if (query.template) {
    // templatesStore.clearTemplates()
    await getTemplateDetail(query.template)
  }
})
</script>