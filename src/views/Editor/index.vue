<template>
  <el-config-provider :locale="locale.el">
    <Computer v-if="!isMobile()" />
    <Mobile v-else />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { isMobile } from '@/utils/common'
import Computer from '@/views/Editor/computer.vue'
import Mobile from '@/views/Editor/mobile.vue'
import useI18n from '@/hooks/useI18n'
const { messages }= useI18n()
const locale = computed(() => messages.value)
</script>