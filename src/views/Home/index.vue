<template>
  <div>
    <el-container>
      <el-header class="border-b-[1px] items-center flex">
        <el-row class="justify-between items-center">
          <el-col :span="4" class="h-[50px]">
            <img src="@/assets/logo.svg" alt="" class="h-full">
          </el-col>
          <el-col :span="6" class="flex justify-end">
            <el-button type="primary" @click="handleLoginDialog">登陆/注册</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="216px">
          <el-menu active-text-color="#000" default-active="1" class="pt-[20px] h-lvh">
            <el-menu-item index="1">
              <IconMapDraw/>为你推荐
            </el-menu-item>
            <el-menu-item index="2">
              智能AI
            </el-menu-item>
            <el-menu-item index="3">
              <IconMapDraw/>模版空间
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main @scroll="handleScroll" class="h-lvh" id="main">
          <MainSearch />
          <MainScene />
          <MainTools />
          <el-row class="mt-[40px]">
            <b class="text-[20px]">今日推荐</b>
          </el-row>
          <TransitionGroup :name="resultReactive.move ? 'group' : ''" tag="div" class="waterfall-box" id="homeWaterfall">
            <div class="waterfall-item" v-for="(item, index) in resultReactive.items" :key="item.id">
              <img class="pic" :src="item.previewURL + '?image/auto-orient,1/quality,q_50'" alt="" :ref="(e: any) => setItemStyle(e, index)" @click="changeTemplate(item.id)">
              <div class="title">{{ item.title }}</div>
              <div class="content ellipsis_2">{{ item.text }}</div>
            </div>
          </TransitionGroup>
        </el-main>
      </el-container>
    </el-container>
    <LoginDialog :visible="loginVisible" @close="handleLoginDialog" />
  </div>
</template>

<script lang="ts" setup>
import MainSearch from './components/MainSearch.vue';
import MainScene from './components/MainScene.vue';
import MainTools from './components/MainTools.vue';
import { getTemplateInfoPages } from '@/api/template'
import { TemplateItem } from '@/api/template/types'
import { throttle } from 'lodash-es'
import { PageSize } from "@/configs/size"
import { useRouter } from 'vue-router'

const router = useRouter()
const loginVisible = ref(false)

const resultReactive = reactive({
  loading: false,
  page: 1,
  totalPage: 1,
  column: 6,
  move: true,
  items: [] as TemplateItem[],
});

const handleScroll = throttle(async () => {
  const mainElement = document.getElementById('main') as HTMLElement
  const scrollHeight = mainElement.scrollHeight, scrollTop = mainElement.scrollTop, clientHeight = mainElement.clientHeight
  if (scrollHeight - (scrollTop + clientHeight) <= 200) {
    if (resultReactive.page < resultReactive.totalPage) {
      resultReactive.page += 1
      await getTemplateItems()
    }
  }
}, 300)

const handleLoginDialog = (status: boolean) => {
  loginVisible.value = status
}

const setItemStyle = (img: HTMLImageElement, index: number) => {
  if (!img) return;
  const update = () => {
    const item = img.parentElement;
    if (!item) return;
    const gapRows = index >= resultReactive.column ? 8 : 0;
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

const getTemplateItems = async () => {
  const pageParams = { page: resultReactive.page, size: PageSize }
  const result = await getTemplateInfoPages(pageParams)
  if (result.data && result.data.code === 200) {
    resultReactive.page = result.data.data.page
    resultReactive.totalPage = result.data.data.total_pages
    resultReactive.items = resultReactive.items.concat(result.data.data.items)
  }
}

const changeTemplate = (pk: number) => {
  const { href } = router.resolve({
    path: '/',
    query: {
      template: pk
    }
  })
  window.open(href, '_blank')
}

let observer: ResizeObserver;

onMounted(() => {
  // getData(true);
  getTemplateItems()
  const el = document.getElementById('homeWaterfall') as HTMLElement;
  observer = new ResizeObserver((entries) => {
    const rect = entries[0].contentRect;
    if (rect.width > 1200) {
      resultReactive.column = 6;
    } 
    else if (rect.width > 900) {
      resultReactive.column = 5;
    } 
    else if (rect.width > 600) {
      resultReactive.column = 4;
    }
    else if (rect.width > 300) {
      resultReactive.column = 3;
    }
    else if (rect.width > 200) {
      resultReactive.column = 2;
    }
    el.style.setProperty("--column", resultReactive.column.toString());
  });
  observer.observe(el);
});

onUnmounted(() => {
  observer.disconnect();
})

</script>

<style lang="scss" scoped>
.el-aside .el-menu .el-menu-item {
  height: 40px;
  padding-left: 0;
  padding-right: 0;
  margin-left: var(--el-menu-level-padding);
  border-radius: 5px;
  &:hover {
    background-color: #f1f2f4;
  }
}

.group-move,
.group-enter-active,
.group-leave-active {
  transition: .8s all;
}

.group-enter-from,
.group-leave-to {
  opacity: 0;
  transform: translate3d(0px, 30px, 0);
}

.group-leave-active {
  position: absolute;
}

.waterfall-box {
  --column: 6;
  display: grid;
  grid-template-columns: repeat(var(--column), 1fr);
  grid-gap: 0 20px;
  padding: 20px 0;
  align-items: end;
  .waterfall-item {
    background-color: #fff;
    margin-bottom: 20px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
    padding: 10px;
    .pic {
      display: block;
      width: 100%;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 14px;
      outline: 1px solid $borderColor;
      cursor: pointer;
      &:hover {
        outline-color: $themeColor;
      }
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .content {
      font-size: 14px;
      color: #222;
      line-height: 20px;
      height: 40px;
    }
  }
}
</style>
<style scoped>
:deep(.row-home .el-input .el-select) {
  width: 115px;
  height: 40px;
}
:deep(.row-home .el-input .el-select__wrapper) {
  width: 115px;
  height: 40px;
}
</style>