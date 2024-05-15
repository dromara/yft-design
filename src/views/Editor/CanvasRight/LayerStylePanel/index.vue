<template>
  <div @click.stop="cancelElement">
    <el-row class="layout-search">
      <el-input
        v-model="keywords"
        :prefix-icon="Search"
        :placeholder="$t('message.searchLayer')"
      ></el-input>
    </el-row>
    <LayerDraggableSelf :elements="layerObjects" :index="0" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, unref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import { useTemplatesStore } from "@/store";
import { ElementNames } from "@/types/elements";
import { WorkSpaceThumbType } from "@/configs/canvas";
import LayerDraggableSelf from "./components/LayerDraggableSelf.vue";
import useHandleElement from "@/hooks/useHandleElement";

// 搜索关键字
const keywords = ref('')

const templatesStore = useTemplatesStore();
const { currentTemplate } = storeToRefs(templatesStore);
const { cancelElement } = useHandleElement();
const layerObjects = computed(() => {
  const _keywords = unref(keywords)
  if(!_keywords) return currentTemplate.value.objects.filter(
    (item) => !WorkSpaceThumbType.includes(item.id) && item.type.toLowerCase() !== ElementNames.REFERENCELINE
  )
  return currentTemplate.value.objects.filter(
    (item) => !WorkSpaceThumbType.includes(item.id) && item.type.toLowerCase() !== ElementNames.REFERENCELINE && item.type.toLowerCase().includes(_keywords) 
  )
});
</script>

<style lang="scss" scoped>
.layout-search {
  margin: 0 auto;
  width: 68%;
  padding: 20px 10px 10px;
}
</style>