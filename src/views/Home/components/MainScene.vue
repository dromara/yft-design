<template>
  <section class="scene-container">
    <div v-for="item in HomeScenes" :key="item.label" class="scene-col">
      <div class="item-title">{{ item.name }}</div>
      <div class="item-subtitle">{{ item.label }}</div>
    </div>
    <!-- <IconLeftC class=""
      v-show="false" />
    <IconRightC
      class="" /> -->
  </section>
</template>

<script setup lang="ts">
import { HomeScenes } from '@/configs/home';
</script>

<style lang="scss" scoped>
.scene-container {
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  gap: 16px;
  margin:16px 0 40px 0;
}

.scene-col {
  flex-basis: 1;
  min-width: 120px;
  height: 60px;
  padding: 12px 16px 0 16px;
  border-radius: 10px;
  background: #f6f7f9;
  cursor: pointer;
  .item-title {
    font-size: 14px;
    color: #222529;
    margin-bottom: 4px;
  }

  .item-subtitle {
    font-size: 12px;
    color: #b4b8bf;
  }

  &:hover {
    background:#f1f2f4;
  }
}
</style>