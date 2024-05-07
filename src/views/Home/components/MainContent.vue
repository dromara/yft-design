<template>
  <div class="mx-[20px]">
    <el-row :gutter="20" class="h-[100px] flex items-center row-home">
      <el-col :span="10" :offset="7">
        <el-input class="h-[40px]" :prefix-icon="Search" placeholder="五一假期">
          <template #append>
            <el-select v-model="searchSelect" placeholder="Select">
              <el-option label="精选模版" value="1" />
              <el-option label="我的空间" value="2" />
            </el-select>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-row class="overflow-hidden flex-nowrap relative">
        <el-col v-for="item in HomeScenes" :span="2" class="scene-col">
          <el-row>{{ item.name }}</el-row>
          <el-row>{{ item.label }}</el-row>
        </el-col>
      </el-row>
      <IconLeftC class="absolute top-[50%] -translate-y-[50%] -translate-x-[50%] text-[32px] cursor-pointer" v-show="false" />
      <IconRightC class="absolute top-[50%] left-[100%] -translate-y-[50%] -translate-x-[50%] text-[32px] cursor-pointer" />
    </el-row>
    <el-row class="mt-[40px]">
      <el-row>
        <el-col :span="13">
          <b class="text-[20px]">常用工具</b>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="10">
          <b class="text-[20px]">常用物料</b>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="13">
          <el-row class="bg-[#eee] rounded-[10px] h-[120px] justify-between">
            <el-col v-for="item in HomeTools" :span="4" class="tool-col">
              <el-row>{{ item.name }}</el-row>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="10">
          <el-row class="bg-[#eee] rounded-[10px] h-[120px] justify-between">
            <el-col v-for="item in HomeMaterials" :span="4" class="tool-col">
              <el-row>{{ item.name }}</el-row>
              <el-row>{{ item.label }}</el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
    <el-row class="mt-[40px]">
      <el-col>
        <b class="text-[20px]">今日推荐</b>
      </el-col>
    </el-row>
    <TransitionGroup :name="page.move ? 'group' : ''" tag="div" class="waterfall-box" ref="waterfallRef">
      <div class="waterfall-item" v-for="(item, index) in page.list" :key="item.id">
        <img class="pic" :src="item.photo" alt="" :ref="e => setItemStyle(e as any, index)">
        <div class="title">{{ item.title }}</div>
        <div class="content ellipsis_2">{{ item.text }}</div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue';
import { reactive, onMounted, onUnmounted } from "vue";
import { HomeScenes, HomeTools, HomeMaterials } from '@/configs/home';
import { ItemList } from '@/api/template/types';
import { getList } from '@/api/template'

const searchSelect = ref<string>('1')
const page = reactive({
  loading: false,
  column: 6,
  move: true,
  list: [] as ItemList,
});

const setItemStyle = (img: HTMLImageElement, index: number) => {
  if (!img) return;
  const update = () => {
    const item = img.parentElement;
    if (!item) return;
    const gapRows = index >= page.column ? 8 : 0;
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

const getData = async (reset = false) => {
  page.loading = true;
  const res = await getList(20);
  page.loading = false;
  if (res.code === 1) {
    if (reset) {
      page.list = res.data;
    } else {
      page.list = page.list.concat(res.data);
    }
  }
}

function refresh() {
  getData(true);
}

let observer: ResizeObserver;

onMounted(() => {
  refresh();
  const el = document.querySelector(".waterfall-box")! as HTMLElement;
  observer = new ResizeObserver((entries) => {
    const rect = entries[0].contentRect;
    if (rect.width > 1200) {
      page.column = 6;
    } else if (rect.width > 900) {
      page.column = 5;
    } else if (rect.width > 600) {
      page.column = 4;
    }
    el.style.setProperty("--column", page.column.toString());
  });
  observer.observe(el);
});

onUnmounted(() => {
  observer.disconnect();
})

defineExpose({
  getData,
});

</script>

<style lang="scss" scoped>
.flex-nowrap {
  flex-wrap: nowrap;
}
.scene-col {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  margin-right: 10px;
  border-radius: 10px;
  background: #f1f1f1;
  cursor: pointer;
  &:hover {
    background: #eee;
  }
}
.tool-col {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  margin: 5px;
  border-radius: 10px;
  background: #fff;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    background: #fff;
  }
}
.water-list {
  width: 100%;
  padding: 20px 14px;
  .water-list-column {
    flex: 1;
    padding: 0 6px;
    .water-list-item {
      // width: 100%;
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
  .water-list-column + .water-list-column {
    margin-left: 14px;
  }
}
.water-list.develop {
  outline: #13ce66 dashed 1px;
  .water-list-column {
    outline: #1890FF solid 1px;
    .water-list-item {
      outline: #fdd835 solid 1px;
    }
  }
}
.top {
  width: 100%;
  height: 80px;
  border-bottom: solid 1px #ddd;
  background-color: #fff;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 10;
  .link {
    font-size: 14px;
    padding: 4px 12px;
    color: #13ce66;
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