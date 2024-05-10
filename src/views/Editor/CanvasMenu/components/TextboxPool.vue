<template>
  <div class="layout-pool">
    <el-row class="layout-search">
      <el-input :prefix-icon="Search" :placeholder="t('message.searchText')"></el-input>
    </el-row>
    <el-row class="layout-text" @click="drawText(80)">
      <div class="large">{{ t("message.addTitle") }}</div>
    </el-row>
    <el-row class="layout-text" @click="drawText(60)">
      <div class="middle">{{ t("message.addSubtitle") }}</div>
    </el-row>
    <el-row class="layout-text" @click="drawText(36)">
      <div class="small">{{ t("message.addBodyText") }}</div>
    </el-row>
    <el-row class="layout-style">
      <el-col :span="16">
        <el-radio-group class="full-ratio" v-model="textStyle">
          <el-radio-button :label="t('message.transverse')" value="transverse"
            ><IconTextRotationNone
          /></el-radio-button>
          <el-radio-button :label="t('message.direction')" value="direction"
            ><IconTextRotationDown
          /></el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="8">
        <el-checkbox-button v-model="textHollow"><IconText />{{ t("message.hollowOut") }}</el-checkbox-button>
      </el-col>
    </el-row>
    <el-tabs v-model="activeTemplate" class="layout-tabs">
      <el-tab-pane :label="t('message.recommendText')" name="data">{{t("message.recommendText")}}</el-tab-pane>
      <el-tab-pane :label="t('message.myBookmarksText')" name="self">{{t("message.myTemplate")}}</el-tab-pane>
      <el-tab-pane :label="t('message.myPurchasesText')" name="team">{{t("message.TeamTemplate")}}</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import useHandleCreate from "@/hooks/useHandleCreate";
import useI18n from "@/hooks/useI18n";

const { t } = useI18n();
const { createTextElement } = useHandleCreate();

const textStyle = ref<"transverse" | "direction">("transverse");
const textHollow = ref(false);
const activeTemplate = ref("data");

const drawText = (fontSize: number) => {
  createTextElement(fontSize, textStyle.value, textHollow.value);
};
</script>

<style lang="scss" scoped>
:deep(.el-tabs__item) {
  padding: 0;
}
.layout-search {
  margin: 0 auto;
  width: 68%;
  padding: 20px 10px 10px;
}
.layout-style {
  margin: 0 auto;
  padding: 20px;
}
.full-ratio {
  display: flex;
  flex: 1;
  .el-radio-button {
    position: relative;
    display: inline-flex;
    outline: 0;
  }
  .el-radio-button__inner {
    width: 100%;
  }
}
.layout-text {
  margin: 0 auto;
  padding: 10px;
  justify-content: center;
  cursor: pointer;
  .large {
    font-size: 24px;
    font-weight: bold;
    margin-top: 0px;
    overflow: hidden; 
    text-overflow: ellipsis;
    white-space: nowrap; 
    &:hover {
      overflow: visible;
      padding: 0 5px;
      border-radius: 5px;
      background-color: #f3f3f3;
    }
  }
  .middle {
    font-size: 16px;
    font-weight: bold;
    &:hover {
      padding: 0 5px;
      border-radius: 5px;
      background-color: #f3f3f3;
    }
  }
  .small {
    font-size: 14px;
    &:hover {
      border-radius: 5px;
      padding: 0 5px;
      background-color: #f3f3f3;
    }
  }
}
.layout-tabs {
  width: 90%;
  margin: 0 auto;
}
.layout-templates {
  display: flex;
  flex-wrap: wrap;
  padding: 2px;
  .thumbnail {
    display: flex;
    width: 124px;
    margin: 2px;
  }
  .thumbnail img {
    outline: 1px solid $borderColor;
    margin: 0 5px;
    cursor: pointer;
    &:hover {
      outline-color: $themeColor;
    }
  }
}
</style>
<style>
.el-tabs .el-tabs__nav {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  width: 100%;
}
</style>
<style scoped>
:deep(.full-ratio .el-radio-button__inner) {
  width: 100%;
}
:deep(.full-ratio .el-radio-button) {
  position: relative;
  display: inline-flex;
  outline: 0;
  flex: 1;
  width: 50%;
}
</style>