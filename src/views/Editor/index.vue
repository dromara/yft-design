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
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import { isMobile } from '@/utils/common'
import { LocalStorageDiscardedKey } from '@/configs/canvas'
const { databaseId } = storeToRefs(useMainStore())

const { messages }= useI18n()
const locale = computed(() => messages.value)
if (import.meta.env.MODE === 'production') {
  window.onbeforeunload = () => false
}

// 应用注销时向 localStorage 中记录下本次 indexedDB 的数据库ID，用于之后清除数据库
window.addEventListener('unload', () => {
  const discardedDB = localStorage.getItem(LocalStorageDiscardedKey)
  const discardedDBList: string[] = discardedDB ? JSON.parse(discardedDB) : []
  discardedDBList.push(databaseId.value)
  const newDiscardedDB = JSON.stringify(discardedDBList)
  localStorage.setItem(LocalStorageDiscardedKey, newDiscardedDB)
})
</script>