<template>
  <div class="slide-design-panel">
    <div>
      <el-button @click="handleReturn">
        <b><IconLeft/>返回</b>
      </el-button>
    </div>
    <el-row>

    </el-row>
    <el-row class="row-info">
      <el-col :span="12"><b>填充·描边</b></el-col>
      <el-col :span="12">
        <el-row class="info-handler">
          <el-col :span="6" class="handler-item">
            <IconPlus/>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="row-effect" v-for="(item, index) in elementEffects">
      <el-row>
        <el-col :span="12" class="effect-layer">
          <IconHamburgerButton class="layer-icon"/>
          层{{ index }}
        </el-col>
        <el-col :span="12">
          <el-row class="effect-handler">
            <el-col :span="6" class="handler-item">
              <IconCopy />
            </el-col>
            <el-col :span="6" class="handler-item">
              <IconPreviewOpen v-if="item.visible"/>
              <IconPreviewClose v-else/>
            </el-col>
            <el-col :span="6" class="handler-item">
              <IconMinus/>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="effect-style">
        <el-col :span="6">
          <el-checkbox v-model="checked2">填充</el-checkbox>
        </el-col>
        <el-col :span="6">
          <el-popover trigger="click" placement="bottom" :width="265">
            <template #reference>
              <ColorButton :color="fill || '#fff'" />
            </template>
            <ColorPicker :modelValue="fill" @update:modelValue="(color: string) => updateBackground({color: color, fill: color})" />
          </el-popover>
        </el-col>
      </el-row>
      <el-row class="effect-style">
        <el-col :span="6">
          <el-checkbox v-model="checked2">描边</el-checkbox>
        </el-col>
        <el-col :span="18">
          <el-row class="style-row">
            <el-col :span="8">
              <el-input></el-input>
            </el-col>
            <el-col :span="8">
              <el-select>
                <el-option></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-popover trigger="click" placement="bottom" :width="265">
                <template #reference>
                  <ColorButton :color="fill || '#fff'" />
                </template>
                <ColorPicker :modelValue="fill" @update:modelValue="(color: string) => updateBackground({color: color, fill: color})" />
              </el-popover>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="effect-style">
        <el-col :span="6">
          <el-checkbox v-model="checked2">偏移</el-checkbox>
        </el-col>
        <el-col :span="18">
          <el-row class="style-row">
            <el-col :span="8">
              <el-input></el-input>
            </el-col>
            <el-col :span="8">
              <el-input></el-input>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
    <el-row class="row-info">
      <el-col :span="12"><b>投影</b></el-col>
      <el-col :span="12">
        <el-row class="info-handler">
          <el-col :span="6" class="handler-item">
            <IconPlus/>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="row-effect" v-for="(item, index) in elementEffects">
      <el-row>
        <el-col :span="12" class="effect-layer">
          <el-row>
            <el-col :span="4">
              <IconHamburgerButton class="layer-icon" />
            </el-col>
            <el-col :span="4">
              <IconContrastViewCircle class="layer-icon icon-size" />
            </el-col>
            <el-col :span="16">基础投影</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row class="effect-handler">
            <el-col :span="6" class="handler-item">
              <IconCopy />
            </el-col>
            <el-col :span="6" class="handler-item">
              <IconPreviewOpen v-if="item.visible"/>
              <IconPreviewClose v-else/>
            </el-col>
            <el-col :span="6" class="handler-item">
              <IconMinus/>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { Rect } from "fabric";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import { ref, watch, onMounted, computed } from "vue";
import { mm2px, px2mm } from "@/utils/image";
import { RightStates } from '@/types/elements'
import useI18n from "@/hooks/useI18n";
import { useFabricStore, useMainStore, useTemplatesStore } from "@/store";

import useCanvas from "@/views/Canvas/useCanvas";
import Backgrounds from "../Backgrounds/index.vue";
import useHistorySnapshot from "@/hooks/useHistorySnapshot";
import useCanvasScale from '@/hooks/useCanvasScale'

const { t } = useI18n();

const mainStore = useMainStore();
const templatesStore = useTemplatesStore();
const fabricStore = useFabricStore();
const { addHistorySnapshot } = useHistorySnapshot();
const { sizeMode, unitMode, rightState } = storeToRefs(mainStore);
const { currentTemplate } = storeToRefs(templatesStore);
const { clip, safe, zoom, opacity } = storeToRefs(fabricStore);
const { setCanvasSize, resetCanvas } = useCanvasScale()


const elementEffects = ref([{}, {}])

const handleReturn = () => {
  rightState.value = RightStates.ELEMENT_STYLE
}


</script>

<style lang="scss" scoped>
.row-info {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  .el-col {
    display: flex;
    align-items: center;
  }
  .info-handler {
    justify-content: end;
  }
}

.row-effect {
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  .effect-handler {
    justify-content: end;
    .el-col {
      justify-content: center;
      align-items: center;
    }
  }
  .effect-layer {
    display: flex;
    align-items: center;
    .layer-icon {
      font-size: 12px;
    }
    .icon-size {
      font-size: 14px;
    }
  }
  .effect-style {
    margin-top: 10px;
    justify-content: space-between;
    .style-row {
      justify-content: end;
      .el-col {
        .color-btn {
          margin-left: 1px;
        }
      }
    }
    .color-btn {
      width: 99%;
    }
  }
}

.handler-item {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 2px;
  border-radius: $borderRadius;
  font-size: 16px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background: #f1f1f1;
    .icon-down {
      margin-top: 3px;
    }
  }
}
</style>

<style scoped>
:deep(.effect-style .el-input .el-input__wrapper) {
  padding: 1px 5px;
  margin-right: 1px;
}
:deep(.effect-style .el-select .el-select__wrapper) {
  padding: 0 5px;
}
</style>