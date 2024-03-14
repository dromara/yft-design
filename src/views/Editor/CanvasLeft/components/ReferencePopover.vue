<template>
  <div>
    <el-popover placement="right" trigger="click" :popper-style="{padding: 0}" width="300" @before-enter="setReference(true)" @hide="setReference(false)" :ref="props.referencePopoverRef" :virtual-ref="props.referenceRef" virtual-triggering>
      <el-row>
        <el-col :span="4">方向</el-col>
        <el-col :span="20">
          <el-radio-group v-model="radio1" class="ml-4">
            <el-radio value="1" size="large">X 轴</el-radio>
            <el-radio value="2" size="large">Y 轴</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">位置</el-col>
        <el-col :span="20">
          <el-radio-group v-model="radio1" class="ml-4">
            <el-radio value="1" size="large">X 轴</el-radio>
            <el-radio value="2" size="large">Y 轴</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
    </el-popover>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const hasReference = ref(false)
const hasHotkey = ref(false)

const props = defineProps({
  referenceRef: {
    type: null,
  },
  referencePopoverRef: {
    type: null
  }
})

const emit = defineEmits<{
  (event: 'change', payload: FileList): void
}>()

const setReference = (val: boolean) => {
  hasReference.value = val
}

</script>
<style lang="scss" scoped>
.reference-pop-row {
  font-size: 15px;
  padding: 10px 25px;
  cursor: pointer;
  .reference-pop-icon {
    font-size: 20px;
  }

  .reference-pop-text {
    padding-left: 10px;
  } 
}
.reference-pop-row:hover {
  background-color: $hoverColor;
}
</style>