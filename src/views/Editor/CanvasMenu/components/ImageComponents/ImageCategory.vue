<template>
  <div class="category-container" ref="containerRef" @scroll="onContainerScroll">
    <div v-for="item in imageCategoryData" >
      <el-row class="category-tip mt-5">
        <el-col :span="5" class="category-name">{{ item.name }}</el-col>
        <el-col :span="7" class="category-name">
          <el-button text>
            全部<IconRight/>
          </el-button>
        </el-col>
      </el-row>
      <el-row class="category-box mt-5" v-loading="item.data.length === 0">
        <div :style="{width: (img.previewHeight <= 150 ? img.previewWidth / img.previewHeight * 150 : img.previewWidth) + 'px'}" v-for="img in item.data" class="box-image">
          <img :src="img.previewURL" :alt="img.tags">
        </div>
      </el-row>
    </div>
    <el-row class="category-bottom">到底了~</el-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ImageCategoryInfo } from '@/configs/images'
import { getImageCategory } from '@/api/image'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
const mainStore = useMainStore()
const { imageCategoryType, imageCategoryData } = storeToRefs(mainStore)

const containerRef = ref<HTMLDivElement>();

const getImageCategoryData = async (type: string) => {
  const res = await getImageCategory({t: type})
  if (res && res.data.code === 200) {
    imageCategoryData.value.filter(item => item.type === type).map(ele => ele.data = res.data.data.slice(0, 2))
  }
}

const getContainScroll = () => {
  let startIndex = 0, endIndex = 2
  if (!containerRef.value) 
  return {
    startIndex,
    endIndex
  }
  const scrollTop = containerRef.value.scrollTop;
  const containerHeight = containerRef.value.clientHeight;
  const itemHeight = 132;
  startIndex = Math.floor(scrollTop / itemHeight);
  endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);
  return {
    startIndex,
    endIndex
  }
}

const onContainerScroll = async () => {
  const { startIndex, endIndex } = getContainScroll()
  for (let i = startIndex; i < endIndex; i++) {
    const item = ImageCategoryInfo[i]
    if (!item) return
    if (!imageCategoryType.value.includes(item.type)) {
      imageCategoryType.value.push(item.type)
      await getImageCategoryData(item.type)
    }
  }
  // console.log('categoryVisible:', categoryVisible.value)
}

onMounted(() => {
  // containerRef.value.addEventListener('scroll', onContainerScroll)
  if (!containerRef.value) return
  onContainerScroll()
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
.mt-5 {
  margin-top: 5px;
}
.category-box {
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
  height: 100px;
}
.box-image {
  display: flex;
  align-items: center;
  padding: 0 2px;
  &:first-child {
    justify-content: flex-start;
  }
  &:last-child {
    justify-content: flex-end;
  }
  img {
    max-width: 100%;
    cursor: pointer;
  }
  
}
.category-container {
  overflow-y: scroll;
  height: 100vh;
  align-items: center;
}
.category-bottom {
  justify-content: center;
  padding-top: 20px;
  margin-bottom: 130px;
}
</style>