<template>
  <div class="layout-pool">
    <el-row class="layout-search">
      <el-col :span="5">
        <FileInput @change="(files: FileList) => drawImage(files)">
          <el-tooltip placement="top" :hide-after="0" content="上传图片">
            <el-button type="primary">
              <IconUpload />
            </el-button>
          </el-tooltip>
        </FileInput>
      </el-col>
      <el-col :span="19">
        <el-input :prefix-icon="Search" placeholder="搜索图片"></el-input>
      </el-col>
    </el-row>
    <el-tabs v-model="activeImage" class="layout-tabs">
      <el-tab-pane label="推荐图片" name="data">
        <ImageCategory/>
      </el-tab-pane>
      <el-tab-pane label="我的收藏" name="self">
        
      </el-tab-pane>
      <el-tab-pane label="我的购买" name="team">团队模板</el-tab-pane>
    </el-tabs>
    
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getImageDataURL } from '@/utils/image'

import useHandleCreate from '@/hooks/useHandleCreate'
import ImageCategory from './ImageComponents/ImageCategory.vue'
const { createImageElement } = useHandleCreate()


const activeImage = ref('data')
const drawImage = (files: FileList) => {
  const imageFile = files[0]
  if (!imageFile) return
  getImageDataURL(imageFile).then(dataURL => createImageElement(dataURL))
}
</script>

<style lang="scss" scoped>
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