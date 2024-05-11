<template>
  <div class="canvas-design-panel">
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
          <el-col :span="6" class="handler-item" @click="addStroke">
            <IconPlus/>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="row-effect" v-for="(item, index) in handleElement.effects?.filter(ele => ele.type === 0)">
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
            <el-col :span="6" class="handler-item" @click.stop="subEffect(item.id)">
              <IconMinus />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="effect-style">
        <el-col :span="6">
          <el-checkbox v-model="item.isFill">填充</el-checkbox>
        </el-col>
        <el-col :span="6">
          <el-popover trigger="click" placement="bottom" :width="265">
            <template #reference>
              <ColorButton :color="handleElement.fill || '#fff'" />
            </template>
            <ColorPicker :modelValue="handleElement.fill" @update:modelValue="(color: string) => updateFill(color)" />
          </el-popover>
        </el-col>
      </el-row>
      <el-row class="effect-style">
        <el-col :span="6">
          <el-checkbox v-model="item.isStroke">描边</el-checkbox>
        </el-col>
        <el-col :span="18">
          <el-row class="style-row">
            <el-col :span="8">
              <el-input-number v-model="item.strokeWidth" @change="updateStrokeWidth" controls-position="right" />
            </el-col>
            <el-col :span="8">
              <el-select v-model="item.strokeLineJoin" @change="updateElement">
                <el-option value="bevel" :label="$t('style.bevel')"></el-option>
                <el-option value="round" :label="$t('style.round')"></el-option>
                <el-option value="miter" :label="$t('style.miter')"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-popover trigger="click" placement="bottom" :width="265">
                <template #reference>
                  <ColorButton :color="item.stroke || '#fff'" />
                </template>
                <ColorPicker :modelValue="item.stroke" @update:modelValue="(color: string) => updateStroke(color, item.id)" />
              </el-popover>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="effect-style">
        <el-col :span="6">
          <el-checkbox v-model="item.isSkew">偏移</el-checkbox>
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
          <el-col :span="6" class="handler-item" @click="addShadow">
            <IconPlus/>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="row-effect" v-for="(item, index) in handleElement.effects?.filter(ele => ele.type === 1)">
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
            <el-col :span="6" class="handler-item" @click.stop="subEffect(item.id)">
              <IconMinus />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { Image, Rect, Textbox, IText, Object as FabricObject, Group } from "fabric";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import { ref, watch, onMounted, computed } from "vue";
import { mm2px, px2mm } from "@/utils/image";
import { ElementNames, RightStates, SupportEffects } from '@/types/elements'

import { useFabricStore, useMainStore, useTemplatesStore } from "@/store";
import useI18n from "@/hooks/useI18n";
import useCanvas from "@/views/Canvas/useCanvas";
import Backgrounds from "../Backgrounds/index.vue";
import useHistorySnapshot from "@/hooks/useHistorySnapshot";
import useCanvasScale from '@/hooks/useCanvasScale'
import { EffectItem } from "@/types/common";
import { nanoid } from "nanoid";

const { t } = useI18n();

const mainStore = useMainStore();
const templatesStore = useTemplatesStore();
const fabricStore = useFabricStore();
const { addHistorySnapshot } = useHistorySnapshot();
const { canvasObject, rightState } = storeToRefs(mainStore);
const { currentTemplate } = storeToRefs(templatesStore);
const { clip, safe, zoom, opacity } = storeToRefs(fabricStore);
const { setCanvasSize, resetCanvas } = useCanvasScale();
const handleElement = computed(() => canvasObject.value as Image | IText | Group);

const handleReturn = () => {
  rightState.value = RightStates.ELEMENT_STYLE
}

const addStroke = () => {
  const strokeItem = {
    type: 0,
    id: nanoid(8),
    isFill: false,
    isStroke: false,
    isSkew: false,
    stroke: '#fff',
    strokeWidth: 1,
    strokeLineJoin: 'round' as CanvasLineJoin
  }
  if (!handleElement.value.effects) {
    handleElement.value.effects = [strokeItem]
  }
  else {
    handleElement.value.effects?.push(strokeItem)
  }
}

const subEffect = (key: string) => {
  handleElement.value.effects = handleElement.value.effects?.filter(item => item.id !== key)
  updateElement()
}

const addShadow = () => {
  const strokeItem = {
    type: 1,
    id: nanoid(8),
    isFill: false,
    isStroke: false,
    isSkew: false,
    stroke: '#fff',
    strokeWidth: 1,
    strokeLineJoin: 'round' as CanvasLineJoin
  }
  if (!handleElement.value.effects) {
    handleElement.value.effects = [strokeItem]
  }
  else {
    handleElement.value.effects?.push(strokeItem)
  }
}

const updateFill = (color: string) => {
  handleElement.value.fill = color
}

const updateStroke = (color: string, key: string) => {
  handleElement.value.effects?.filter(item => item.id === key).map(ele => ele.stroke = color)
  updateElement()
}

const updateStrokeWidth = () => {
  updateElement()
}

const updateElement = () => {
  if (!handleElement.value.effects) return
  const elementType = handleElement.value.type.toLowerCase()
  if (!SupportEffects.includes(elementType)) return
  if (elementType === ElementNames.GROUP || elementType === ElementNames.ACTIVE) {
    const groupObject = handleElement.value as Group
    groupObject._objects.forEach(item => {
      if (SupportEffects.includes(item.type.toLowerCase())) {
        const element = item as IText
        element.set({effects: handleElement.value.effects})
        element.renderEffects()
      }
    })
  } 
  else {
    (handleElement.value as IText | Image).renderEffects()
  }
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

<style lang="scss" scoped>
:deep(.effect-style .el-input .el-input__wrapper) {
  padding: 1px 5px;
  margin-right: 1px;
}
:deep(.effect-style .el-input .el-input__inner) {
  text-align: left;
}
:deep(.effect-style .el-select .el-select__wrapper) {
  padding: 0 5px;
}
:deep(.effect-style .el-select .el-select__placeholder) {
  width: 200%;
}
:deep(.style-row .el-input-number) {
  width: 60px;
}
:deep(.style-row .el-input-number span) {
  width: 12px;
  border-right: 1px solid var(--el-border-color);
}
</style>