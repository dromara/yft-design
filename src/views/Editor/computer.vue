<!--
 * @Author: June 1601745371@qq.com
 * @Date: 2024-04-12 11:31:10
 * @LastEditors: June 1601745371@qq.com
 * @LastEditTime: 2024-04-18 17:20:58
 * @FilePath: \yft-design\src\views\Editor\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="h-full" v-drop-image="{ url: 'UploadUrl', highlightStyle: { backgroundColor: 'lightblue' } }">
    <div class="layout-content flex">
      <CanvasLeft class="layout-content-left w-[50px] h-[100vh] z-10 bg-[#fff]" />
      <CanvasMenu class="layout-content-menu" />
      <CanvasThumb class="w-[160px] h-full flex flex-shrink-0 bg-[#fff] flex-col select-none" />
      <div class="layout-content-center">
        <CanvasHeader class="center-header relative flex justify-between py-[10px] text-[14px] select-none h-[39px]" />
        <CanvasCenter class="center-body" />
        <CanvasFooter class="center-footer h-[40px] relative leading-1.5 flex justify-between" />
        <CanvasAffix  class="center-affix"/>
      </div>
      <CanvasRight class="layout-content-right h-full w-[260px] bg-[#fff] flex flex-col" />
      <CanvasDom class="absolute -z-[200] -left-[300px]" />
    </div>
    <CanvasTour />
  </div>
</template>

<script lang="ts" setup>
import CanvasLeft from "./CanvasLeft/index.vue";
import CanvasMenu from "./CanvasMenu/index.vue";
import CanvasThumb from "./CanvasThumb/index.vue";
import CanvasHeader from "./CanvasHeader/index.vue";
import CanvasCenter from "./CanvasCenter/index.vue";
import CanvasRight from "./CanvasRight/index.vue";
import CanvasFooter from "./CanvasFooter/index.vue";
import CanvasAffix from "./CanvasAffix/index.vue";
import CanvasDom from "./CanvasDom/index.vue";
import CanvasTour from "./CanvasTour/index.vue";
</script>

<style lang="scss" scoped>
.layout-content {
  height: calc(100% - 40px);
}
.layout-content-left {
  // border-right: solid 1px $borderColor;
}
.layout-content-center {
  width: calc(100% - 50px - 160px - 260px);

  .center-header {
    border-left: 1px solid $borderColor;
  }
  .center-body {
    height: calc(100% - 40px);
    // margin: 100px;
  }
  .center-footer {
    border-top: 1px solid $borderColor;
    background-color: $lightGray;
  }
}
.layout-content-right {
  border-left: solid 1px $borderColor;
}
</style>
