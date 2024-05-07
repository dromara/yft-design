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
        <el-main @scroll="handleScroll" class="h-lvh" id="main">
          <MainContent ref="contentRef"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import MainContent from './components/MainContent.vue';
import { ref } from 'vue';

const contentRef = ref()

function rafThrottle(fn: Function) {
  let lock = false;
  return function (this: any, ...args: any[]) {
    if (lock) return;
    lock = true;
    window.requestAnimationFrame(() => {
      fn.apply(this, args);
      lock = false;
    });
  };
}

const handleScroll = rafThrottle(() => {
  const mainElement = document.getElementById('main') as HTMLElement
  const scrollHeight = mainElement.scrollHeight, scrollTop = mainElement.scrollTop, clientHeight = mainElement.clientHeight
  if (scrollHeight - (scrollTop + clientHeight) <= 200) {
    contentRef.value?.getData()
  }
})

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