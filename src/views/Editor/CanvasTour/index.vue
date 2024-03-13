<template>
  <div>
    <el-tour v-model="open" @close="closeTour()" @finish="closeTour()">
      <el-tour-step target=".left-top-tabs" title="">
        <div>快速创建设计，上传文件，参考线精准定位！</div>
      </el-tour-step>
      <el-tour-step target="#left-tabs-editor" :title="$t('message.edit')" description="打造您的图文故事，轻松编辑，享受各种信息的可视化操作界面，让创意自由流淌！" />
      <el-tour-step target="#left-tabs-template" :title="$t('message.template')" description="探索推荐模板，整合我的模版和团队传承，拓展创意边界，共创卓越作品。" />
      <el-tour-step target="#left-tabs-material" :title="$t('message.material')" description="发现推荐素材，管理我的收藏，回顾我的购买，一处整合，创意无限延展。" />
      <el-tour-step target="#left-tabs-text" :title="$t('message.text')" description="横纵搭配，镂空新意，文字排版艺术的创造。" />
      <el-tour-step target="#left-tabs-image" :title="$t('message.image')" description="上传心仪图片，探索精选推荐，整理我的收藏，美图尽在掌握之间。" />
      <el-tour-step target="#left-tabs-toolkit" :title="$t('message.tool')" description="快速生成条形码、二维码，AI智能抠图技术，提升效率体验智能之选。" />
      <el-tour-step target="#left-tabs-layer" :title="$t('message.layer')" description="拖动排序、一键显示或隐藏元素；轻松锁定、解锁图层，创意无限，随意删除，掌控您的设计流程。" />
      <el-tour-step target="#left-tabs-help" :title="$t('message.help')" description="遇难题？访问帮助中心！新手指南、使用教程、快捷键助您提效，意见即刻反馈，在线客服实时解答。" />
    </el-tour>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { localStorage } from "@/utils/storage";

const open = ref(localStorage.get("YFT_DESIGN_TOUR") ?? true);
const closeTour = () => {
  open.value = false;
  localStorage.set("YFT_DESIGN_TOUR", false);
};
</script>

<style lang="scss" scoped></style>
