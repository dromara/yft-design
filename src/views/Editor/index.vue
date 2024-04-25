<template>
  <el-config-provider :locale="elLocale.el">
    <Computer v-if="!isMobile()"/>
    <Mobile v-else />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { isMobile } from '@/utils/common'
import Computer from '@/views/Editor/computer.vue'
import Mobile from '@/views/Editor/mobile.vue'

</script>