<template>
  <div class="category-container" ref="containerRef" @scroll="onContainerScroll">
    <div v-for="item in imageCategoryData" v-show="categoryRef === 'all' || categoryRef === item.type">
      <el-row class="category-tip mt-5" v-if="categoryRef === 'all'">
        <el-col :span="5" class="category-name">
          <el-tag>{{ item.name }}</el-tag>
        </el-col>
        <el-col :span="7" class="category-name">
          <el-button text @click="showTotal(item.type)">全部<IconRight/></el-button>
        </el-col>
      </el-row>
      <el-row class="category-tip mt-5" v-else>
        <el-col :span="7" class="category-name">
          <el-button text @click="hideTotal()"><IconLeft/>{{ item.name }}</el-button>
        </el-col>
      </el-row>
      <el-row class="category-box mt-5" v-loading="item.category.length === 0" v-if="categoryRef === 'all'">
        <div :style="{width: (img.previewHeight <= 120 ? img.previewWidth / img.previewHeight * 120 : img.previewWidth) + 'px'}" v-for="img in item.category" class="box-image">
          <img :src="img.previewURL" :alt="img.tags" @click="createImage(img)">
        </div>
      </el-row>
      <el-row class="category-box mt-5" v-loading="item.total.length === 0" v-else>
        <div :style="{width: (img.previewHeight <= 120 ? img.previewWidth / img.previewHeight * 120 : img.previewWidth) + 'px'}" v-for="img in item.total" class="box-image">
          <img :src="img.previewURL" :alt="img.tags" @click="createImage(img)">
        </div>
      </el-row>
    </div>
    <el-row class="category-bottom">到底了~</el-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { debounce, throttle } from 'lodash'
import { getImageCategory } from '@/api/image'
import { ImageHit } from '@/api/image/types'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import useHandleCreate from '@/hooks/useHandleCreate'
const mainStore = useMainStore()
const { imageCategoryType, imageCategoryData } = storeToRefs(mainStore)
const { createImageElement } = useHandleCreate()

const containerRef = ref<HTMLDivElement>();
const containerTop = ref(0)
const categoryRef = ref('all')

const getImageCategoryData = debounce( async (type: string) => {
  const res = await getImageCategory({t: type})
  if (res && res.data.code === 200) {
    imageCategoryData.value.filter(item => item.type === type).map(ele => ele.category = res.data.data.slice(0, 2))
  }
}, 300, { trailing: true })

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
    const item = imageCategoryData.value[i]
    if (!item) return
    if (!imageCategoryType.value.includes(item.type)) {
      imageCategoryType.value.push(item.type)
      await getImageCategoryData(item.type)
    }
    if (item.category.length === 0) {
      await getImageCategoryData(item.type)
    }
  }
}

const showTotal = (type: string) => {
  if (!containerRef.value) return
  containerTop.value = containerRef.value.scrollTop
  categoryRef.value = type
  console.log('show-containerTop.value:', containerTop.value)
}

const hideTotal = () => {
  categoryRef.value = 'all'
  if (!containerRef.value) return
  console.log('hide-containerTop.value:', containerTop.value)
  containerRef.value.scrollTo({top: containerTop.value, behavior: 'smooth'})
}

const createImage = (item: ImageHit) => {
  createImageElement(item.largeImageURL)
}

onMounted(() => {
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