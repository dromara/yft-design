<template>
  <div>
    <el-row class="layout-search">
      <el-input
        :prefix-icon="Search"
        :placeholder="$t('message.searchTemp')"
      ></el-input>
    </el-row>
    <el-tabs v-model="activeTemplate" class="layout-tabs">
      <el-tab-pane :label="$t('message.recommendTemp')" name="data">
        <div class="layout-templates" @scroll="handleScroll" ref="templateRef">
          <div v-for="(item, index) in templateItems" :key="item.id" class="thumbnail">
            <img :src="item.previewURL + '?x-oss-process=style/img_tum'" alt="" :ref="(e: any) => setItemStyle(e, index)" @click="handleChangeTemplate(item)"/>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('message.myTemp')" name="self">
        <el-radio-group v-model="activeSelfTemplate" size="large" class="full-ratio">
          <el-radio-button value="buy" :label="$t('message.myPurchases')" />
          <el-radio-button value="collect" :label="$t('message.myFavorites')" />
        </el-radio-group>
      </el-tab-pane>
      <el-tab-pane :label="$t('message.teamTemp')" name="team">{{ $t("message.teamTemp") }}</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { Search } from "@element-plus/icons-vue"
import { onMounted, ref } from "vue"
import { getTemplateDetailPages } from '@/api/template'
import { TemplateItem } from '@/api/template/types'
import { useTemplatesStore } from '@/store'
import { ElMessage, ElMessageBox } from 'element-plus'
import { unzip } from "@/utils/crypto"
import { PageSize } from "@/configs/size"
import { throttle, debounce } from 'lodash-es'

const templatesStore = useTemplatesStore()
const templateItems = ref<TemplateItem[]>([])
const activeTemplate = ref("data");
const activeSelfTemplate = ref("buy");
const page = ref(1)
const totalPage = ref(1)
const templateRef = ref<HTMLElement | undefined>()

const setItemStyle = (img: HTMLImageElement, index: number) => {
  if (!img) return;
  const update = () => {
    const item = img.parentElement;
    if (!item) return;
    const gapRows = index >= 2 ? 2 : 0;
    const rows = Math.ceil(item.clientHeight / 2) + gapRows;
    item.style.gridRowEnd = `span ${rows}`;
  }
  update();
  img.onload = update;
  img.onerror = function() {
    img.src = new URL(`/src/assets/images/loading.gif`, import.meta.url).href;
    update();
  };
}

const handleScroll = debounce(async () => {
  const mainElement = templateRef.value as HTMLElement
  const scrollHeight = mainElement.scrollHeight, scrollTop = mainElement.scrollTop, clientHeight = mainElement.clientHeight
  if (scrollHeight - (scrollTop + clientHeight) <= 200) {
    if (page.value < totalPage.value) {
      page.value += 1
      await getTemplateItems()
    }
  }
}, 300)

const getTemplateItems = async () => {
  const pageParams = { page: page.value, size: PageSize }
  const result = await getTemplateDetailPages(pageParams)
  if (result.data && result.data.code === 200) {
    page.value = result.data.data.page
    totalPage.value = result.data.data.total_pages
    templateItems.value = templateItems.value.concat(result.data.data.items)
  }
}

const handleChangeTemplate = (item: TemplateItem) => {
  ElMessageBox.confirm(
    '是否确认更换模板？',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
      const templateData = unzip(item.data)
      const data = JSON.parse(templateData)
      console.log('data:', data)
      await templatesStore.changeTemplate(data)
      ElMessage({
        type: 'success',
        message: '更换模板成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: '模板加载失败,请联系管理员修改bug了',
      })
    })
  
}

onMounted(async () => {
  await getTemplateItems()
})
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
.layout-tabs {
  width: 90%;
  margin: 0 auto;
}
.layout-templates {
  overflow: scroll;
  height: 100vh;
  flex-wrap: wrap;
  padding: 2px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 2px 0;
  padding-bottom: 20px;
  align-items: start;
  .thumbnail {
    padding: 2px 0;
  }
  .thumbnail img {
    outline: 1px solid $borderColor;
    width: 124px;
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
    width: 100%;
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