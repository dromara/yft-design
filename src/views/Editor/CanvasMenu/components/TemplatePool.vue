<template>
  <div>
    <el-row class="layout-search">
      <el-input :prefix-icon="Search" placeholder="搜索模板"></el-input>
    </el-row>
    <el-tabs v-model="activeTemplate" class="layout-tabs">
      <el-tab-pane label="推荐模板" name="data">
        <div class="layout-templates">
          <div v-for="item in Templates" :key="item.index" class="thumbnail">
            <img :src="item.url" alt="" style="width: 124px; height: 74.4px">
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的模板" name="self">
        <el-radio-group v-model="activeSelfTemplate" size="large" class="full-ratio">
          <el-radio-button value="buy" label="我购买的" />
          <el-radio-button value="collect" label="我收藏的" />
        </el-radio-group>
      </el-tab-pane>
      <el-tab-pane label="团队模板" name="team">团队模板</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
// import { storeToRefs } from 'pinia'
// import { useSlidesStore } from '@/store'
import { Templates } from '@/mocks/templates'
import useI18n from '@/hooks/useI18n'

const { t } = useI18n()



const activeTemplate = ref('data')
const activeSelfTemplate = ref('buy')
// const selectSlideTemplate = (tid: string) => {
//   const templateDetail = templateInfo.value.filter(template => template.template_id === tid)[0]
//   emit('select', JSON.parse(templateDetail.template_data))
// }

// onMounted(async () => {
//   const queryData = await getTemplateInfoData()
//   templateInfo.value = queryData.data.data
// })
</script>

<style lang="scss" scoped>
.layout-search {
  margin: 0 auto;
  width: 68%;
  padding: 20px 10px 10px;
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
.full-ratio {
  display: flex;
  flex: 1;
  .el-radio-button {
    width: 50%;
  }
  .el-radio-button__inner {
    width: 100%
  }
}
:deep(.full-ratio .el-radio-button__inner) {
  width: 100%;
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