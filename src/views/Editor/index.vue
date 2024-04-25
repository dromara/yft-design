<template>
  <el-config-provider :locale="elLocale.el">
    <Editor v-if="!isMobile()"/>
    <Mobile v-else />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { isMobile } from '@/utils/common'
import Editor from '@/views/Editor/pc.vue'
import Mobile from '@/views/Editor/mobile.vue'

</script>