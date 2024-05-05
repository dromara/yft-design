<template>
  <div class="app">
    <div class="container" ref="fContainerRef">
      <FsBookVirtualWaterfall2 :request="getData" :gap="15" :page-size="20" :column="column" :enter-size="column * 2">
        <template #item="{ item, imageHeight }">
          <fs-book-card
            :detail="{
              imageHeight,
              title: item.title,
              author: item.author,
              bgColor: item.bgColor,
            }"
          />
        </template>
      </FsBookVirtualWaterfall2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useTemplatesStore } from "@/store";
import FsBookCard from "./FsBookCard.vue";
import FsBookVirtualWaterfall2 from "./FsBookVirtualWaterfall2.vue";
import { ICardItem } from "@/types/templates";
import list from "@/configs/card";
import { storeToRefs } from "pinia";
const fContainerRef = ref<HTMLDivElement | null>(null);
const templatesStore = useTemplatesStore()
const { mainRef } = storeToRefs(templatesStore)
const column = ref(6);
const containerObserver = new ResizeObserver((entries) => {
  changeColumn(entries[0].target.clientWidth);
});

const changeColumn = (width: number) => {
  if (width > 960) {
    column.value = 5;
  } else if (width >= 690 && width < 960) {
    column.value = 4;
  } else if (width >= 500 && width < 690) {
    column.value = 3;
  } else {
    column.value = 2;
  }
};

onMounted(() => {
  fContainerRef.value && containerObserver.observe(fContainerRef.value);
});

onUnmounted(() => {
  fContainerRef.value && containerObserver.unobserve(fContainerRef.value);
});

const getData = (page: number, pageSize: number) => {
  return new Promise<ICardItem[]>((resolve) => {
    setTimeout(() => {
      resolve(list.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize));
    }, 1000);
  });
};

</script>

<style scoped lang="scss">
.app {
  //display: flex;
  //align-items: center;
  //justify-content: center;
  //width: 100vw;
  //height: 100vh;
  .container {
    width: 1400px;
    height: 600px;
    border: 1px solid red;
  }
}
</style>
