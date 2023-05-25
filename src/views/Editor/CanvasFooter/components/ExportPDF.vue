<template>
  <div class="export-pdf-dialog">
    <div class="configs">
      <div class="row">
        <div class="title">导出范围：</div>
        <el-radio-group class="config-item" v-model="rangeType">
          <el-radio-button style="width: 50%;" value="all">全部页面</el-radio-button>
          <el-radio-button style="width: 50%;" value="current">当前页面</el-radio-button>
        </el-radio-group>
      </div>
      <div class="row">
        <div class="title">每页数量：</div>
        <el-select class="config-item" v-model:value="count">
          <el-option :value="1">1</el-option>
          <el-option :value="2">2</el-option>
          <el-option :value="3">3</el-option>
        </el-select>
      </div>
      <div class="row">
        <div class="title">边缘留白：</div>
        <div class="config-item">
          <el-switch v-model:checked="padding" />
        </div>
      </div>
      <div class="tip">
        注意：若打印预览与实际样式不一致，请在弹出的打印窗口中勾选【背景图形】选项。
      </div>
    </div>

    <div class="btns">
      <el-button class="btn export" type="primary" @click="expPDF()">导出PDF</el-button>
      <el-button class="btn close" @click="emit('close')">关闭</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import useCanvasExport from '@/hooks/useCanvasExport'
// import { useSlidesStore } from '@/store'
// import { print } from '@/utils/print'

// import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

const { exportPDF } = useCanvasExport()

const emit = defineEmits<{
  (event: 'close'): void
}>()

// const { slides, currentSlide, viewportRatio } = storeToRefs(useSlidesStore())

const rangeType = ref<'all' | 'current'>('all')
const count = ref(1)
const padding = ref(false)

const expPDF = () => {
  exportPDF()
  // if (!pdfThumbnailsRef.value) return
  // const pageSize = {
  //   width: 1600,
  //   height: rangeType.value === 'all' ? 1600 * viewportRatio.value * count.value : 1600 * viewportRatio.value,
  //   margin: padding.value ? 50 : 0,
  // }
  // print(pdfThumbnailsRef.value, pageSize)
}
</script>

<style lang="scss" scoped>
.export-pdf-dialog {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.thumbnails-view {
  @include absolute-0();

  &::after {
    content: '';
    background-color: #fff;
    @include absolute-0();
  }
}
.thumbnail {
  &.break-page {
    break-after: page;
  }
}
.configs {
  width: 300px;
  height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;

  .row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 25px;
  }

  .title {
    width: 100px;
  }
  .config-item {
    flex: 1;
  }

  .tip {
    font-size: 12px;
    color: #aaa;
    line-height: 1.8;
    margin-top: 25px;
  }
}
.btns {
  width: 300px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  .export {
    flex: 1;
  }
  .close {
    width: 100px;
    margin-left: 10px;
  }
}
</style>