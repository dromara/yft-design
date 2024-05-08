<template>
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
</template>

<script setup lang="ts">
import { HomeTools, HomeMaterials } from '@/configs/home';
</script>

<style lang="scss" scoped>
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