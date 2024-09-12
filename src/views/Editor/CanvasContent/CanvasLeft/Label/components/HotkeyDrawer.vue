<template>
  <el-drawer v-model="props.hasHotkey" :with-header="false" size="320">
    <div class="hotkey-doc">
      <template v-for="item in HOTKEY_DOC" :key="item.type">
        <div class="title">{{item.type}}</div>
        <div class="hotkey-item" v-for="hotkey in item.children" :key="hotkey.label">
          <div class="label">{{hotkey.label}}</div>
          <div class="value">{{hotkey.value}}</div>
        </div>
      </template>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { HOTKEY_DOC } from '@/configs/hotkey' 
const props = defineProps({
  hasHotkey: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.hotkey-doc {
  height: 100%;
  overflow: auto;
  font-size: 12px;
  margin: 0 -20px;
  padding: 0 24px;
}
.title {
  font-size: 14px;
  font-weight: 700;
  border-bottom: 1px solid #e5e5e5;
  padding: 24px 0 5px 0;

  &:first-child {
    padding-top: 0;
  }
}
.hotkey-item {
  border-bottom: 1px solid #e5e5e5;
  padding: 15px 0 5px 0;
  display: flex;
  align-items: center;
}
.label {
  width: 140px;

  @include ellipsis-oneline();
}
</style>