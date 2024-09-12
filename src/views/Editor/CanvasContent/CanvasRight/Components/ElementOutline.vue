<template>
  <div class="element-outline">
    <div class="row">
      <div style="flex: 2">
        <b>{{ $t("style.enableBorder") }}：</b>
      </div>
      <div class="switch-wrapper" style="flex: 3">
        <el-switch v-model="openOutline" @change="toggleOutline"></el-switch>
      </div>
    </div>
    <template v-if="openOutline">
      <div class="row">
        <div style="flex: 2">{{ $t("style.borderStyle") }}：</div>
        <el-select
          style="flex: 3"
          v-model="outlineStyle"
          @change="changeOutlineStyle"
        >
          <el-option :value="0" :label="$t('style.solidBorder')"></el-option>
          <el-option :value="1" :label="$t('style.dashedBorder')"></el-option>
        </el-select>
      </div>
      <div class="row">
        <div style="flex: 2">{{ $t("style.borderColor") }}：</div>
        <el-popover trigger="click" width="265">
          <template #reference>
            <ColorButton :color="handleElement.stroke" style="flex: 3" />
          </template>
          <ColorPicker
            :modelValue="handleElement.stroke"
            @update:modelValue="(color: string) => updateOutlineColor(color)"
          />
        </el-popover>
      </div>
      <div class="row">
        <div style="flex: 2">{{ $t("style.borderThickness") }}：</div>
        <el-input-number
          style="flex: 3"
          v-model="handleElement.strokeWidth"
          @change="changeOutlineStyle"
        ></el-input-number>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useMainStore } from "@/store";
import { CanvasElement } from "@/types/canvas";
import useCanvas from "@/views/Canvas/useCanvas";

const [canvas] = useCanvas();
const { canvasObject } = storeToRefs(useMainStore());
const outlineStyle = ref(0);
const handleElement = computed(() => canvasObject.value as CanvasElement);
const hasOutline = computed(() => {
  if (!handleElement.value) return false;
  return handleElement.value.stroke ? true : false;
});
const openOutline = ref(hasOutline.value);

const toggleOutline = () => {
  if (!handleElement.value) return;
  if (openOutline.value) {
    handleElement.value.stroke = "#555";
    handleElement.value.strokeWidth = 1;
  } else {
    handleElement.value.stroke = "";
  }
  canvas.renderAll();
};

const changeOutlineStyle = () => {
  if (!handleElement.value) return;
  handleElement.value.strokeDashArray = null;
  if (outlineStyle.value === 1) {
    handleElement.value.strokeDashArray = [6, 6];
  }
  canvas.renderAll();
};

const updateOutlineColor = (color: string) => {
  handleElement.value.stroke = color;
  canvas.renderAll();
};
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
</style>