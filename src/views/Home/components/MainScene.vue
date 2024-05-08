<template>
  <el-row>
    <el-row class="overflow-hidden flex-nowrap relative">
      <el-col v-for="item in HomeScenes" :span="2" class="scene-col">
        <el-row>{{ item.name }}</el-row>
        <el-row>{{ item.label }}</el-row>
      </el-col>
    </el-row>
    <IconLeftC class="absolute top-[50%] -translate-y-[50%] -translate-x-[50%] text-[32px] cursor-pointer" v-show="false" />
    <IconRightC class="absolute top-[50%] left-[100%] -translate-y-[50%] -translate-x-[50%] text-[32px] cursor-pointer" />
  </el-row>
</template>

<script setup lang="ts">
import { HomeScenes } from '@/configs/home';
</script>

<style lang="scss" scoped>
.flex-nowrap {
  flex-wrap: nowrap;
}
.scene-col {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  margin-right: 10px;
  border-radius: 10px;
  background: #f1f1f1;
  cursor: pointer;
  &:hover {
    background: #eee;
  }
}
</style>