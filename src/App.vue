<!--
 * @Author: June 1601745371@qq.com
 * @Date: 2024-03-08 09:06:56
 * @LastEditors: June 1601745371@qq.com
 * @LastEditTime: 2024-03-11 12:00:19
 * @FilePath: \github\yft-design\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-config-provider :locale="elLocale.el">
    <Editor v-if="!isMobile()"/>
    <Mobile v-else />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { deleteDiscardedDB } from '@/utils/database'
import { useMainStore, useSnapshotStore } from '@/store'
import { storeToRefs } from 'pinia'
import { isMobile } from '@/utils/common'
import { LocalStorageDiscardedKey } from '@/configs/canvas'
import Editor from '@/views/Editor/index.vue'
import Mobile from './views/Editor/mobile.vue'
import useI18n from '@/hooks/useI18n'

const { messages }= useI18n()
const elLocale = computed(() => messages.value)
console.log(elLocale)

const snapshotStore = useSnapshotStore()
const mainStore = useMainStore()
const { databaseId } = storeToRefs(useMainStore())

onMounted(async () => {
  await deleteDiscardedDB()
  await snapshotStore.initSnapshotDatabase()
  mainStore.setSystemFonts()
})

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

<style lang="scss">
#app {
  height: 100%;
}
</style>