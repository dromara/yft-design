<template>
  <div class="absolute bottom-[5px] text-[12px] icp">
    进网许可证：<a href="https://beian.miit.gov.cn/">鄂ICP备2022008030号-1</a>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.icp {
  width: calc(100% - 260px - 50px - 160px);
  display: flex;
  justify-content: center;
  a:hover {
    text-decoration: underline;
  }
}
</style>