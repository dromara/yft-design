<template>
  <div class="yft-design" v-drop-image="{ url: 'YourUploadUrl', highlightStyle: { backgroundColor: 'lightblue' } }">
    <div class="layout-content">
      <CanvasLeft class="layout-content-left" />
      <CanvasMenu class="layout-content-menu" />
      <CanvasThumb class="layout-content-thumb" />
      <div class="layout-content-center">
        <CanvasHeader class="center-header" />
        <CanvasCenter class="center-body" />
        <CanvasFooter class="center-footer" />
        <CanvasAffix class="center-affix" />
      </div>
      <CanvasRight class="layout-content-right" />
      <CanvasDom class="layout-content-dom" />
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
.yft-design {
  height: 100%;
}
.layout-header {
  height: 40px;
}
.layout-content {
  height: calc(100% - 40px);
  display: flex;
}
.layout-content-left {
  width: 50px;
  height: 100vh;
  z-index: 10;
  background: #fff;
  border-right: solid 1px $borderColor;
}
.layout-content-thumb {
  width: 160px;
  height: 100%;
  display: flex;
  flex-shrink: 0;
  border-right: solid 1px $borderColor;
  background-color: #fff;
  flex-direction: column;
  user-select: none;
}
.layout-content-center {
  width: calc(100% - 50px - 160px - 260px);

  .center-header {
    position: relative;
    border-bottom: 1px solid $borderColor;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    font-size: 13px;
    user-select: none;
    height: 40px;
  }
  .center-body {
    height: calc(100% - 40px);
    // margin: 100px;
  }
  .center-footer {
    height: 40px;
    position: relative;
    border-top: 1px solid $borderColor;
    background-color: $lightGray;
    line-height: 1.5;
    display: flex;
    justify-content: space-between;
  }
}
.layout-content-right {
  width: 260px;
  height: 100%;
  border-left: solid 1px $borderColor;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
.layout-content-dom {
  // background: pink;
  position: absolute;
  z-index: -200;
  // height: 100%;
  // top: -200px;
}
</style>
