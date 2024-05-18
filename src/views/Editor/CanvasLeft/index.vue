<template>
  <div class="flex">
    <Label class="w-[50px] h-[100vh] z-10 bg-[#fff]" />
    <Menu />
    <Thumb class="w-[160px] h-full flex flex-shrink-0 bg-[#fff] flex-col select-none" />
  </div>
</template>

<script lang="ts" setup>
import Label from "./Label/index.vue";
import Menu from "./Menu/index.vue";
import Thumb from "./Thumb/index.vue";
</script>