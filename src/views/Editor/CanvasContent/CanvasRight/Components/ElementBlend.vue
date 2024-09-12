<template>
  <div class="element-blend">
    <el-row class="blend-row">
      <el-col :span="12" class="belnd-col">
        <div class="blend-name">{{ $t('style.blendMode') }}</div>
      </el-col>
      <el-col :span="12">
        <el-select v-model="elementBlend" @change="changeBlendMode">
          <el-option v-for="item in BlendModes" :key="item.id" :value="item.key" :label="item.name"></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useMainStore } from "@/store";
import { Image } from "fabric";
import { BlendModes } from '@/configs/images';
import useCanvas from "@/views/Canvas/useCanvas";


const { canvasObject } = storeToRefs(useMainStore());
const handleElement = computed(() => canvasObject.value as Image);
const imageBlend = computed(() => handleElement.value.globalCompositeOperation)
const elementBlend = ref(imageBlend.value);

const changeBlendMode = (globalCompositeOperation: string) => {
  const [ canvas ] = useCanvas();
  handleElement.value.set({globalCompositeOperation})
  canvas.renderAll()
}

</script>

<style lang="scss" scoped>
.blend-row {
  margin-top: 10px;
}
.belnd-col {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}
</style>