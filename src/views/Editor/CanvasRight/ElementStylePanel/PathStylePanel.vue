<template>
  <div class="shape-style-panel">
    <ElementFill />
    <el-divider />
    <ElementFlip />

    <template v-if="handlePathText">
      <el-row class="mt-10">
        <el-col :span="12">
          <el-select>
            <el-option value="0"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-select>
            <el-option value="0"></el-option>
          </el-select>
        </el-col>
      </el-row> 

      <el-row class="mt-10">
        <el-col :span="6">
          <el-tooltip placement="top" content="文字颜色">
            <div @click.stop class="tooltip-popover">
              <el-popover trigger="click" placement="bottom" :width="265" @click.stop>
                <template #reference>
                  <el-button class="font-color">
                    <IconText />
                  </el-button>
                </template>
                <ColorPicker :modelValue="fontColor"/>
              </el-popover>
            </div>
          </el-tooltip>
        </el-col>
        <el-col :span="6">
          <el-tooltip placement="top" content="文字高亮">
            <div @click.stop class="tooltip-popover">
              <el-popover trigger="click" placement="bottom" :width="265">
                <template #reference>
                  <el-button class="high-light">
                    <IconHighLight />
                  </el-button>
                </template>
                <ColorPicker :modelValue="fontColor"/>
              </el-popover>
            </div>
          </el-tooltip>
        </el-col>
        <el-col :span="12">
          <el-button-group class="full-group">
            <el-tooltip placement="top" content="增大字号">
              <el-button class="font-size">
                <IconFontSize />+
              </el-button>
            </el-tooltip>

            <el-tooltip placement="top" content="减小字号">
              <el-button>
                <IconFontSize />-
              </el-button>
            </el-tooltip>
          </el-button-group>
        </el-col>
      </el-row>

      <el-row class="mt-10">
        <el-button-group class="full-group">
          <el-tooltip placement="top" content="加粗">
            <el-button><IconTextBold /></el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="斜体">
            <el-button><IconTextItalic /></el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="下划线">
            <el-button><IconTextUnderline /></el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="删除线">
            <el-button><IconStrikethrough /></el-button>
          </el-tooltip>
        </el-button-group>
      </el-row>

      <el-row class="mt-10">
        <el-button-group class="full-group">
          <el-tooltip placement="top" content="清除格式">
            <el-button><IconFormat /></el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="格式刷">
            <el-button><IconFormatBrush /></el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="减小缩进">
            <el-button><IconIndentLeft /></el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="增大缩进">
            <el-button><IconIndentRight /></el-button>
          </el-tooltip>
        </el-button-group>
      </el-row>

      <el-row class="mt-10">
        <el-button-group class="full-group">
          <el-tooltip placement="top" content="左对齐">
            <el-button><IconAlignTextLeft /></el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="居中">
            <el-button><IconAlignTextCenter /></el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="右对齐">
            <el-button><IconAlignTextRight /></el-button>
          </el-tooltip>
        </el-button-group>
      </el-row>

      <el-row class="mt-10">
        <el-button-group class="full-group">
          <el-tooltip placement="top" content="顶对齐">
            <el-button><IconAlignTextTopOne /></el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="居中">
            <el-button><IconAlignTextMiddleOne /></el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="底对齐">
            <el-button><IconAlignTextBottomOne /></el-button>
          </el-tooltip>
        </el-button-group>
      </el-row>
    </template>
    <el-divider />
    <ElementOutline />
    <el-divider />
    <ElementShadow />
    <el-divider />
    <ElementOpacity />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

import ElementOpacity from '../Components/ElementOpacity.vue'
import ElementOutline from '../Components/ElementOutline.vue'
import ElementShadow from '../Components/ElementShadow.vue'
import ElementFlip from '../Components/ElementFlip.vue'
import ElementFill from '../Backgrounds/ElementFill.vue'


const fontColor = ref('#000')
const handlePathText = ref(false)

</script>

<style lang="scss" scoped>
.shape-style-panel {
  user-select: none;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.font-size-btn {
  padding: 0;
}
.slider {
  flex: 3;
}
.mb-10 {
  margin-bottom: 10px;
}
.full-row {
  flex: 1;
  width: 100%;
}

.gradient-box {
  display: flex;
  flex: 1;
  .el-button {
    width: 100%;
  }
}

.mt-10 {
  margin-top: 10px;
}
.full-group {
  display: flex;
  flex: 1;
  .el-button {
    width: 50%;
  }
}

.tooltip-popover {
  .el-button {
    width: 100%;
    border-radius: 0;
  }
  .font-color {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-right: 0;
  }
  .high-light {
    border-right: 0;
  }
}
.font-size {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>