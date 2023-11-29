<template>
  <div>
    <div v-for="item in ImageCategoryInfo">
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
import { onMounted, ref } from 'vue'
import { ImageCategoryInfo } from '@/configs/images'
import { getImageCategory } from '@/api/image'
import { useMainStore } from '@/store';
import { storeToRefs } from 'pinia';
const mainStore = useMainStore()
const { imageCategory } = storeToRefs(mainStore)
const getImageCategoryData = () => {
  ImageCategoryInfo.forEach(async (item) => {
    const res = await getImageCategory({t: item.type})
    imageCategory.value.push({
      type: item.type,
      data: res.data.data
    })
  })
}

onMounted(() => {
  if (!imageCategory.value) {
    getImageCategoryData()
  }
})

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