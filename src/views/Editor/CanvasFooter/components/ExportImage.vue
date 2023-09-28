<template>
  <div class="export-img-dialog">
    <div class="configs">
      <div class="row">
        <div class="title">导出格式：</div>
        <el-radio-group class="config-item" v-model="format">
          <el-radio-button style="width: 50%;" value="jpeg" label="jpeg">JPEG</el-radio-button>
          <el-radio-button style="width: 50%;" value="png" label="png">PNG</el-radio-button>
        </el-radio-group>
      </div>
      <div class="row">
        <div class="title">导出范围：</div>
        <el-radio-group class="config-item" v-model="rangeType">
          <el-radio-button style="width: 50%;" value="all" label="all">全部</el-radio-button>
          <el-radio-button style="width: 50%;" value="current" label="current">当前页</el-radio-button>
          <!-- <el-radio-button style="width: 33.33%;" value="custom" label="custom">自定义</el-radio-button> -->
        </el-radio-group>
      </div>
      <div class="row" v-if="rangeType === 'custom'">
        <div class="title" :data-range="`（${range[0]} ~ ${range[1]}）`">自定义范围：</div>
        <el-slider class="config-item" range :min="1" :max="templates.length" :step="1" v-model="range"/>
      </div>

      <div class="row">
        <div class="title">图片质量：</div>
        <el-slider class="config-item" :min="0" :max="1" :step="0.1" v-model="quality"/>
      </div>

      <div class="row">
        <div class="title">图片分辨率：</div>
        <el-radio-group class="config-item" v-model="dpiType">
          <el-radio-button style="width: 33.33%;" :value="72" :label="72">72DPI</el-radio-button>
          <el-radio-button style="width: 33.33%;" :value="150" :label="150">150DPI</el-radio-button>
          <el-radio-button style="width: 33.33%;" :value="300" :label="300">300DPI</el-radio-button>
        </el-radio-group>
      </div>


      <div class="row">
        <!-- <div class="title">忽略字体：</div>
        <div class="config-item">
          <el-tooltip :hide-after="0" trigger="hover" placement="top">
            <template #content>
              导出时默认忽略在线字体，若您在页面中使用了在线字体，<br />
              且希望导出后保留相关样式，可选择关闭【忽略字体】选项，<br />
              但要注意这将会增加导出用时。
            </template>
            <el-switch v-model="ignoreWebfont" />
          </el-tooltip>
        </div> -->
        <div class="title">忽略出血：</div>
        <div class="config-item">
          <el-switch v-model="ignoreClip" />
        </div>
      </div>
    </div>

    <div class="btns">
      <el-button class="btn export" type="primary" @click="downloaImage()" v-loading.fullscreen.lock="Exporting">导出图片</el-button>
      <el-button class="btn close" @click="emit('close')">关闭</el-button>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTemplatesStore } from '@/store'
import { ImageFormat } from 'fabric'
import useCanvasExport from '@/hooks/useCanvasExport'

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { templates } = storeToRefs(useTemplatesStore())
const { Exporting, exportImage } = useCanvasExport()


const rangeType = ref<'all' | 'current' | 'custom'>('current')
const dpiType = ref<number>(300)
const range = ref<[number, number]>([1, templates.value.length])
const format = ref<ImageFormat>("jpeg")
const quality = ref(1)
const ignoreWebfont = ref(false)
const ignoreClip = ref(true)

const downloaImage = () => {
  exportImage(format.value, quality.value, dpiType.value, ignoreClip.value)
}
</script>

<style lang="scss" scoped>
.export-img-dialog {
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
.configs {
  width: 350px;
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
    position: relative;

    &::after {
      content: attr(data-range);
      position: absolute;
      top: 20px;
      left: 0;
    }
  }
  .config-item {
    flex: 1;
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
<style>
.config-item .el-radio-button__inner {
  width: 100%;
}
</style>