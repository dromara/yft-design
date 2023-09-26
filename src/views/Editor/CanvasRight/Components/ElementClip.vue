<template>
  <div class="element-text">
    <div class="row">
      <div style="flex: 2;"><b>启用剪切：</b></div>
      <div class="switch-wrapper" style="flex: 3;">
        <el-switch v-model="hasClippath" @change="toggleStroke()"></el-switch>
      </div>
    </div>
    <template v-if="hasClippath">
      <el-row class="mt-10" >
        <el-col :span="12">
          <el-select>
            <el-option value="0"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-select>
            <el-option value="0"></el-option>
          </el-select>
        </el-col>
      </el-row> 
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
const fontColor = ref('#000')
const hasClippath = ref(true)

const toggleStroke = () => {

}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.switch-wrapper {
  text-align: right;
}
.slider {
  flex: 3;
}
</style>