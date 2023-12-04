<template>
  <div>
    <el-popover placement="right" trigger="click" :popper-style="{padding: 0}" @before-enter="setHelp(true)" @hide="setHelp(false)" :ref="props.helpPopoverRef" :virtual-ref="props.helpRef" virtual-triggering>
      <el-row class="help-pop-row">
        <IconGuideBoard class="help-pop-icon"/>
        <span class="help-pop-text">新手入门</span>
      </el-row>
      <el-row class="help-pop-row">
        <IconVideoTwo class="help-pop-icon"/>
        <span class="help-pop-text">使用教程</span>
      </el-row>
      <el-row class="help-pop-row" @click="hasHotkey = true">
        <IconKeyboardOne class="help-pop-icon"/>
        <span class="help-pop-text">快捷键</span>
      </el-row>
      <el-row class="help-pop-row">
        <IconEdit class="help-pop-icon"/>
        <span class="help-pop-text">反馈建议</span>
      </el-row>
      <el-row class="help-pop-row">
        <IconHeadsetOne class="help-pop-icon"/>
        <span class="help-pop-text">在线客服</span>
      </el-row>
    </el-popover>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const hasHelp = ref(false)
const hasHotkey = ref(false)

const props = defineProps({
  helpRef: {
    type: null,
  },
  helpPopoverRef: {
    type: null
  }
})

const emit = defineEmits<{
  (event: 'change', payload: FileList): void
}>()

const setHelp = (val: boolean) => {
  hasHelp.value = val
}

</script>
<style lang="scss" scoped>
.help-pop-row {
  font-size: 15px;
  padding: 10px 25px;
  cursor: pointer;
  .help-pop-icon {
    font-size: 20px;
  }

  .help-pop-text {
    padding-left: 10px;
  } 
}
.help-pop-row:hover {
  background-color: $hoverColor;
}
</style>