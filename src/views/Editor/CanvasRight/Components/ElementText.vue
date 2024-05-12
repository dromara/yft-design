<template>
  <div class="element-text" v-if="handlePathText">
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
        <el-tooltip placement="top" :content="$t('style.color')">
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
        <el-tooltip placement="top" :content="$t('style.highlight')">
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
          <el-tooltip placement="top" :content="$t('style.increaseFontSize')">
            <el-button class="font-size">
              <IconFontSize />+
            </el-button>
          </el-tooltip>

          <el-tooltip placement="top" :content="$t('style.decreaseFontSize')">
            <el-button>
              <IconFontSize />-
            </el-button>
          </el-tooltip>
        </el-button-group>
      </el-col>
    </el-row>

    <el-row class="mt-10">
      <el-button-group class="full-group">
        <el-tooltip placement="top" :content="$t('style.bold')">
          <el-button><IconTextBold /></el-button>
        </el-tooltip>
        <el-tooltip placement="top" :content="$t('style.italic')">
          <el-button><IconTextItalic /></el-button>
        </el-tooltip>
        <el-tooltip placement="top" :content="$t('style.underline')">
          <el-button><IconTextUnderline /></el-button>
        </el-tooltip>
        <el-tooltip placement="top" :content="$t('style.strikethrough')">
          <el-button><IconStrikethrough /></el-button>
        </el-tooltip>
      </el-button-group>
    </el-row>

    <el-row class="mt-10">
      <el-button-group class="full-group">
        <el-tooltip placement="top" :content="$t('style.clearFormat')">
          <el-button><IconFormat /></el-button>
        </el-tooltip>
        <el-tooltip placement="top" :content="$t('style.formatPainter')">
          <el-button><IconFormatBrush /></el-button>
        </el-tooltip>
        <el-tooltip placement="top" :content="$t('style.decreaseIndent')">
          <el-button><IconIndentLeft /></el-button>
        </el-tooltip>
        <el-tooltip placement="top" :content="$t('style.increaseIndent')">
          <el-button><IconIndentRight /></el-button>
        </el-tooltip>
      </el-button-group>
    </el-row>

    <el-row class="mt-10">
      <el-button-group class="full-group">
        <el-tooltip placement="top" :content="$t('style.leftAlign')">
          <el-button><IconAlignTextLeft /></el-button>
        </el-tooltip>
        <el-tooltip placement="top" :content="$t('style.center')">
          <el-button><IconAlignTextCenter /></el-button>
        </el-tooltip>
        <el-tooltip placement="top" :content="$t('style.rightAlign')">
          <el-button><IconAlignTextRight /></el-button>
        </el-tooltip>
      </el-button-group>
    </el-row>

    <el-row class="mt-10">
      <el-button-group class="full-group">
        <el-tooltip placement="top" :content="$t('style.topAlign')">
          <el-button><IconAlignTextTopOne /></el-button>
        </el-tooltip>
        <el-tooltip placement="top" :content="$t('style.center')">
          <el-button><IconAlignTextMiddleOne /></el-button>
        </el-tooltip>
        <el-tooltip placement="top" :content="$t('style.bottomAlign')">
          <el-button><IconAlignTextBottomOne /></el-button>
        </el-tooltip>
      </el-button-group>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
const fontColor = ref('#000')
const handlePathText = ref(true)

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
.slider {
  flex: 3;
}
</style>