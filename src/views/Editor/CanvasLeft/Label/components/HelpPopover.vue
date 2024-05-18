<template>
  <div>
    <el-popover
      placement="right"
      trigger="click"
      :popper-style="{ padding: 0 }"
      @before-enter="setHelp(true)"
      @hide="setHelp(false)"
      :ref="props.helpPopoverRef"
      :virtual-ref="props.helpRef"
      virtual-triggering
    >
      <el-row class="help-pop-row">
        <IconGuideBoard class="help-pop-icon" />
        <span class="help-pop-text">{{ $t("message.BeginnerGuide") }}</span>
      </el-row>
      <el-row class="help-pop-row">
        <IconVideoTwo class="help-pop-icon" />
        <span class="help-pop-text">{{ $t("message.UserGuide") }}</span>
      </el-row>
      <el-row class="help-pop-row" @click="hasHotkey = true">
        <IconKeyboardOne class="help-pop-icon" />
        <span class="help-pop-text">{{ $t("message.Shortcuts") }}</span>
      </el-row>
      <el-row class="help-pop-row">
        <IconEdit class="help-pop-icon" />
        <span class="help-pop-text">{{ $t("message.Suggestions") }}</span>
      </el-row>
      <el-row class="help-pop-row">
        <IconHeadsetOne class="help-pop-icon" />
        <span class="help-pop-text">{{ $t("message.OnlineSupport") }}</span>
      </el-row>
    </el-popover>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const hasHelp = ref(false);
const hasHotkey = ref(false);

const props = defineProps({
  helpRef: {
    type: null,
  },
  helpPopoverRef: {
    type: null,
  },
});

const emit = defineEmits<{
  (event: "change", payload: FileList): void;
}>();

const setHelp = (val: boolean) => {
  hasHelp.value = val;
};
</script>
<style lang="scss" scoped>
.help-pop-row {
  font-size: 12px;
  padding: 10px 10px;
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