<template>
  <div class="layout-pool">
    <el-row class="layout-search">
      <el-col :span="5">
        <FileInput @change="(files: FileList) => drawImage(files)">
          <el-tooltip
            placement="top"
            :hide-after="0"
            :content="$t('message.uploadImages')"
          >
            <el-button type="primary">
              <IconUpload />
            </el-button>
          </el-tooltip>
        </FileInput>
      </el-col>
      <el-col :span="19">
        <el-input
          :prefix-icon="Search"
          :placeholder="$t('message.searchImages')"
        ></el-input>
      </el-col>
    </el-row>
    <el-tabs v-model="activeImage" class="layout-tabs">
      <el-tab-pane :label="$t('message.recommendImages')" name="data">
        <IllustrationCategory />
      </el-tab-pane>
      <el-tab-pane :label="$t('message.myBookmarks')" name="self">
        {{ $t("message.myBookmarks") }}
      </el-tab-pane>
      <el-tab-pane :label="$t('message.teamTemplates')" name="team">{{
        $t("message.teamTemplates")
      }}</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getImageDataURL } from "@/utils/image";

import useHandleCreate from "@/hooks/useHandleCreate";
import ImageCategory from "./ImageComponents/ImageCategory.vue";
import IllustrationCategory from "./ImageComponents/IllustrationCategory.vue";
import useI18n from "@/hooks/useI18n";

const { t } = useI18n();
const { createImageElement } = useHandleCreate();

const activeImage = ref("data");
const drawImage = (files: FileList) => {
  const imageFile = files[0];
  if (!imageFile) return;
  getImageDataURL(imageFile).then((dataURL) => createImageElement(dataURL));
};
</script>

<style lang="scss" scoped>
:deep(.el-tabs__item) {
  padding: 0;
}
.layout-search {
  margin: 0 auto;
  width: 80%;
  padding: 20px 10px 10px;
}
.layout-upload {
  justify-content: center;
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
.col-img {
  height: 100px;
  img {
    max-height: 100%;
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