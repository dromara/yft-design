<template>
  <div class="export-pdf-dialog">
    <div class="configs">
      <div class="row">
        <div class="title">{{ t('message.exportRange') }}：</div>
        <el-radio-group class="config-item" v-model="rangeType">
          <el-radio-button style="width: 50%;" value="all">{{ t('message.allPages') }}</el-radio-button>
          <el-radio-button style="width: 50%;" value="current">{{ t('message.currentPage') }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="row">
        <div class="title">{{ t('message.quantityPerPage') }}：</div>
        <el-select class="config-item" v-model="count" @change="changeCount">
          <el-option value="1" label="1"></el-option>
          <el-option value="2" label="2"></el-option>
          <el-option value="3" label="3"></el-option>
        </el-select>
      </div>
      <div class="row">
        <div class="title">{{ t('message.blankEdges') }}：</div>
        <div class="config-item">
          <el-switch v-model="padding" />
        </div>
      </div>
    </div>

    <div class="btns">
      <el-button class="btn export" type="primary" @click="exportPDF(rangeType)">{{ t('message.exportPDF') }}</el-button>
      <el-button class="btn close" @click="emit('close')">{{ t('message.close') }}</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import useI18n from '@/hooks/useI18n'
import useCanvasExport from '@/hooks/useCanvasExport'
// import { useSlidesStore } from '@/store'
// import { print } from '@/utils/print'

// import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

const { exportPDF } = useCanvasExport()
const { t } = useI18n()
const emit = defineEmits<{
  (event: 'close'): void
}>()

// const { slides, currentSlide, viewportRatio } = storeToRefs(useSlidesStore())

const rangeType = ref<'all' | 'current'>('all')
const count = ref(1)
const padding = ref(false)

const changeCount = (val: number) => {
  count.value = val
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
    width: 120px;
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