<template>
  <div class="element-color-mask">
    <div class="row">
      <div style="flex: 1">
        <b>{{ $t("style.enableMask") }}：</b>
      </div>
      <div class="switch-wrapper" style="flex: 1">
        <el-switch
          v-model="openColorMask"
          @change="toggleColorMask"
        ></el-switch>
      </div>
    </div>
    <template v-if="openColorMask">
      <el-row>
        <el-col :span="7" class="slider-name"
          >{{ $t("style.maskColor") }}：</el-col
        >
        <el-col :span="3"></el-col>
        <el-col :span="14">
          <el-popover trigger="click" width="265">
            <template #reference>
              <ColorButton :color="maskColor" style="flex: 3" />
            </template>
            <ColorPicker
              :modelValue="maskColor"
              @update:modelValue="(color: string) => updateMaskColor(color)"
            />
          </el-popover>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" class="slider-name"
          >{{ $t("style.opacity") }}：</el-col
        >
        <el-col :span="3"></el-col>
        <el-col :span="10">
          <el-slider
            class="slider"
            v-model="maskAlpha"
            :min="0"
            :max="1"
            :step="0.01"
            @change="updateMaskAlpha"
          ></el-slider>
        </el-col>
        <el-col :span="4" class="slider-num">{{ maskAlpha }}</el-col>
      </el-row>
      <el-row>
        <el-select v-model="maskMode" @change="changeImageFilter">
          <el-option value="add" label="add"></el-option>
          <el-option value="difference" label="difference"></el-option>
          <el-option value="subtract" label="subtract"></el-option>
          <el-option value="multiply" label="multiply"></el-option>
          <el-option value="screen" label="screen"></el-option>
          <el-option value="lighten" label="lighten"></el-option>
          <el-option value="darken" label="darken"></el-option>
          <el-option value="overlay" label="overlay"></el-option>
          <el-option value="exclusion" label="exclusion"></el-option>
          <el-option value="tint" label="tint"></el-option>
        </el-select>
      </el-row>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useMainStore } from "@/store";
import { ImageElement } from "@/types/canvas";
import { ElementNames } from "@/types/elements";
import { filters, Image } from "fabric";
import useCanvas from "@/views/Canvas/useCanvas";

const BlendColorFilter = "BlendColor";
const maskColor = ref("");
const maskMode = ref('add')
const maskAlpha = ref(0.3);
const [canvas] = useCanvas();
const { canvasObject } = storeToRefs(useMainStore());

const handleElement = computed(() => canvasObject.value as Image);
const hasColorMask = computed(() => {
  if (!handleElement.value || handleElement.value.type !== ElementNames.IMAGE) return false;
  const blendColorFilter = handleElement.value.filters.filter((obj) => obj.type === BlendColorFilter)[0] as filters.BlendColor;
  if (blendColorFilter) {
    maskColor.value = blendColorFilter.color;
    maskAlpha.value = blendColorFilter.alpha;
    maskMode.value = blendColorFilter.mode;
    return true;
  }
  return false;
});
const openColorMask = ref(hasColorMask.value);

const updateMaskColor = (color: string) => {
  maskColor.value = color;
  changeImageFilter();
};

const updateMaskAlpha = () => {
  changeImageFilter();
};

const changeImageFilter = () => {
  const blendFilter = new filters.BlendColor({
    color: maskColor.value,
    mode: maskMode.value,
    alpha: maskAlpha.value,
  });
  handleElement.value.filters = handleElement.value.filters.filter((obj) => obj.type !== BlendColorFilter);
  handleElement.value.filters.push(blendFilter as filters.BaseFilter);
  handleElement.value.applyFilters();
  canvas.renderAll();
};

const toggleColorMask = () => {
  if (!handleElement.value) return;
  const [canvas] = useCanvas();
  if (openColorMask.value) {
    const blendColorFilter = handleElement.value.filters.filter(
      (obj) => obj.type === BlendColorFilter
    )[0];
    if (!blendColorFilter) {
      const blendFilter = new filters.BlendColor({
        color: maskColor.value,
        mode: "add",
        alpha: maskAlpha.value,
      });
      handleElement.value.filters.push(blendFilter as filters.BaseFilter);
      handleElement.value.applyFilters();
    }
  } else {
    handleElement.value.filters = handleElement.value.filters.filter(
      (obj) => obj.type !== BlendColorFilter
    );
    handleElement.value.applyFilters();
  }
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
.opacity-slider {
  flex: 3;
}
.slider-name {
  display: flex;
  align-items: center;
}
.slider-num {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>