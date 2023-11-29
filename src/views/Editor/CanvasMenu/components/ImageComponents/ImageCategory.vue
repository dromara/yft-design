<template>
  <div>
    <div v-for="item in ImageCategory">
      <el-row class="category-tip">
        <el-col :span="4" class="category-name">{{ item.name }}</el-col>
        <el-col :span="5" class="category-name">
          <el-button type="text">
            全部<IconRight/>
          </el-button>
        </el-col>
      </el-row>
      <el-row class="category-box">

      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ImageCategory } from '@/configs/images'

</script>

<style lang="scss" scoped>
.category-tip {
  justify-content: space-between;
  align-items: center;
}
.category-name {
  text-align: center;
}
.category-box {
  height: 150px;
}
</style>