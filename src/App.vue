<template>
  <Editor v-if="!isMobile()"/>
  <Mobile v-else/>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { deleteDiscardedDB } from '@/utils/database'
import { useMainStore, useSnapshotStore } from '@/store'
import { storeToRefs } from 'pinia'
import { isMobile } from '@/utils/common'
import { LocalStorageDiscardedKey } from '@/configs/canvas'
import Editor from '@/views/Editor/index.vue'
import Mobile from './views/Editor/mobile.vue'

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