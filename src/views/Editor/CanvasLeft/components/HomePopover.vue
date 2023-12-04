<template>
  <div>
    <el-popover 
      placement="right" 
      width="200" 
      trigger="click" 
      popper-class="home-pop" 
      @before-enter="setHome(true)" 
      @hide="setHome(false)" 
      :ref="props.menuPopoverRef" 
      :virtual-ref="props.menuRef"
      virtual-triggering
    >
      <!-- <el-row class="pop-row">
        <IconHome class="pop-icon"/>
        <span class="pop-text">返回首页</span>
      </el-row>
      <el-row class="pop-row">
        <IconEdit class="pop-icon"/>
        <span class="pop-text">未命名</span>
      </el-row> -->
      <el-row class="pop-row">
        <IconNewlybuild class="pop-icon"/>
        <span class="pop-text">创建设计</span>
      </el-row>
      <el-row class="pop-row" @click="openUpload">
        <IconUpload class="pop-icon"/>
        <span class="pop-text">导入文件</span>
      </el-row>
      <el-row class="pop-row">
        <IconDividingLine class="pop-icon"/>
        <span class="pop-text">参考线</span>
      </el-row>
    </el-popover>
    <FileUpload :visible="dialogVisible" @close="closeUpload"/>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
const hasHelp = ref(false)
const popoverVisible = ref(false)
const dialogVisible = ref(false)
const props = defineProps({
  menuRef: {
    type: null,
  },
  menuPopoverRef: {
    type: null
  },
  menuVisibleRef: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (event: 'hide'): void
}>()


const setHome = (val: boolean) => {
  hasHelp.value = val
}

const openUpload = () => {
  dialogVisible.value = true
}

const closeUpload = () => {
  dialogVisible.value = false
}

</script>
<style lang="scss" scoped>
.home-pop {
  margin: 10px;
  padding: 0;
}
.pop-row {
  margin: 0 10px;
  font-size: 15px;
  padding: 10px 25px;
  cursor: pointer;
  .pop-icon {
    font-size: 20px;
  }

  .pop-text {
    padding-left: 10px;
  } 
}
.pop-row:hover {
  border-radius: $borderRadius;
  background-color: $hoverColor;
}
</style>