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
        <el-col v-for="item in scenes" :span="2" class="scene-col">
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
            <el-col v-for="item in tools" :span="4" class="tool-col">
              <el-row>{{ item.name }}</el-row>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="10">
          <el-row class="bg-[#eee] rounded-[10px] h-[120px] justify-between">
            <el-col v-for="item in materials" :span="4" class="tool-col">
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
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue';
import { ref } from 'vue';

const searchSelect = ref<string>('1')
const scenes = ref([
  {id: 0, name: '精选推荐', label: 'RECOMMEND', icon: ''},
  {id: 0, name: '小红书', label: 'REDBOOK', icon: ''},
  {id: 0, name: '公众号', label: 'WECHAT', icon: ''},
  {id: 0, name: '电商', label: 'E-COMMERCE', icon: ''},
  {id: 0, name: '教育培训', label: 'EDUCATION', icon: ''},
  {id: 0, name: '短视频', label: 'VIDEO', icon: ''},
  {id: 0, name: '金融保险', label: 'FINANCIAL', icon: ''},
  {id: 0, name: '粉丝应援', label: 'SUPPORT', icon: ''},
  {id: 0, name: '个人生活', label: 'LIFE', icon: ''},
  {id: 0, name: '设计师', label: 'DESIGN', icon: ''},
  {id: 0, name: '门店', label: 'STORE', icon: ''},
  {id: 0, name: '电竞运营', label: 'ESPORTS', icon: ''},
  {id: 0, name: '精选推荐', label: 'RECOMMEND', icon: ''},
  {id: 0, name: '精选推荐', label: 'RECOMMEND', icon: ''},
  {id: 0, name: '精选推荐', label: 'RECOMMEND', icon: ''},
])

const tools = ref([
  {id: 0, name: '精选推荐', label: 'RECOMMEND', icon: ''},
  {id: 0, name: '小红书', label: 'REDBOOK', icon: ''},
  {id: 0, name: '公众号', label: 'WECHAT', icon: ''},
  {id: 0, name: '电商', label: 'E-COMMERCE', icon: ''},
  {id: 0, name: '教育培训', label: 'EDUCATION', icon: ''},
  {id: 0, name: '短视频', label: 'VIDEO', icon: ''},
  {id: 0, name: '金融保险', label: 'FINANCIAL', icon: ''},
  {id: 0, name: '粉丝应援', label: 'SUPPORT', icon: ''},
  {id: 0, name: '个人生活', label: 'LIFE', icon: ''},
  {id: 0, name: '设计师', label: 'DESIGN', icon: ''},
])

const materials = ref([
  {id: 0, name: '精选推荐', label: 'RECOMMEND', icon: ''},
  {id: 0, name: '小红书', label: 'REDBOOK', icon: ''},
  {id: 0, name: '公众号', label: 'WECHAT', icon: ''},
  {id: 0, name: '电商', label: 'E-COMMERCE', icon: ''},
  {id: 0, name: '教育培训', label: 'EDUCATION', icon: ''},
])
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