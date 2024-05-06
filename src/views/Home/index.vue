<template>
  <div>
    <el-container>
      <el-header class="border-b-[1px] items-center flex">
        <el-row class="justify-between items-center">
          <el-col :span="4" class="h-[50px]">
            <img src="@/assets/logo.svg" alt="" class="h-full">
          </el-col>
          <el-col :span="6" class="flex justify-end">
            <el-button type="primary">登陆/注册</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="216px">
          <el-menu active-text-color="#000" default-active="1" class="pt-[20px] h-lvh">
            <el-menu-item index="1">
              <IconMapDraw/>为你推荐
            </el-menu-item>
            <el-menu-item index="2">
              智能AI
            </el-menu-item>
            <el-menu-item index="3">
              <IconMapDraw/>模版空间
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main @scroll="handleScroll">
          <MainContent ref="mainRef" @handleScroll="handleScroll"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import MainContent from './components/MainContent.vue';
import { useTemplatesStore } from '@/store';
import { storeToRefs } from 'pinia';

const templatesStore = useTemplatesStore()
const { mainRef } = storeToRefs(useTemplatesStore())

const handleScroll = () => {
  console.log('handleScroll:----')
  templatesStore.handleScroll()
}

</script>

<style lang="scss" scoped>

.el-aside .el-menu .el-menu-item {
  height: 40px;
  padding-left: 0;
  padding-right: 0;
  margin-left: var(--el-menu-level-padding);
  border-radius: 5px;
  &:hover {
    background-color: #f1f2f4;
  }
}
</style>