<template>
  <div class="slide-design-panel">
    <div class="mb-10">
      <el-button><b><IconLeft/>返回</b></el-button>
    </div>
    <el-row>

    </el-row>
    <el-row class="row-info">
      <el-col :span="6"><b>填充·描边</b></el-col>
      <el-col :span="5">
        <IconPlus class="handler-item"/>
      </el-col>
    </el-row>
    <el-row class="row-effect" v-for="(item, index) in elementEffects">
      <el-col :span="4">层{{ index }}</el-col>
      <el-col :span="20">
        <el-row class="effect-content">
          <el-col :span="4">层{{ index }}</el-col>
          <el-col :span="4">层{{ index }}</el-col>
          <el-col :span="5">
            <IconPlus class="handler-item"/>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script lang="ts" setup>
import { Rect } from "fabric";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import { ref, watch, onMounted, computed } from "vue";
import { mm2px, px2mm } from "@/utils/image";
import useI18n from "@/hooks/useI18n";
import { useFabricStore, useMainStore, useTemplatesStore } from "@/store";
import {
  WorkSpaceClipType,
  WorkSpaceDrawType,
  WorkSpaceMaskType,
} from "@/configs/canvas";
import {
  DesignUnitMode,
  DesignSizeMode,
  MinSize,
  MaxSize,
} from "@/configs/background";
import useCanvas from "@/views/Canvas/useCanvas";
import Backgrounds from "../Backgrounds/index.vue";
import useHistorySnapshot from "@/hooks/useHistorySnapshot";
import useCanvasScale from '@/hooks/useCanvasScale'

const { t } = useI18n();

const mainStore = useMainStore();
const templatesStore = useTemplatesStore();
const fabricStore = useFabricStore();
const { addHistorySnapshot } = useHistorySnapshot();
const { sizeMode, unitMode } = storeToRefs(mainStore);
const { currentTemplate } = storeToRefs(templatesStore);
const { clip, safe, zoom, opacity } = storeToRefs(fabricStore);
const { setCanvasSize, resetCanvas } = useCanvasScale()

const templateWidth = computed(() => {
  // const [ canvas ] = useCanvas()
  // if (!canvas) return 0
  const workWidth = currentTemplate.value.width / currentTemplate.value.zoom;
  return unitMode.value === 0 ? px2mm(workWidth) : workWidth;
});

const templateHeight = computed(() => {
  // const [ canvas ] = useCanvas()
  // if (!canvas) return 0
  const workHeight = currentTemplate.value.height / currentTemplate.value.zoom;
  return unitMode.value === 0 ? px2mm(workHeight) : workHeight;
});

const elementEffects = ref([{}, {}])
// const canvasWidth = ref<number>(px2mm(currentTemplate.value.width / currentTemplate.value.zoom))
const canvasWidth = ref<number>(templateWidth.value);
const canvasHeight = ref<number>(templateHeight.value);

// 固定宽高
const isFixed = ref(false);

// 直角圆角
const isRound = ref(false);

// 网格 预定义 参数
const RECENT_GRIDS = "RECENT_GRIDS";
const gridColorRecent = ref<[string[]]>([[]]);

// 获取画布尺寸
const getCanvasSize = () => {
  let width =
    unitMode.value === 0 ? mm2px(canvasWidth.value) : canvasWidth.value;
  let height =
    unitMode.value === 0 ? mm2px(canvasHeight.value) : canvasHeight.value;
  width = width * zoom.value;
  height = height * zoom.value;
  return { width, height };
};

// 修改画布宽度
const changeTemplateWidth = () => {
  const [canvas] = useCanvas();
  const workSpaceDraw = canvas
    .getObjects()
    .filter((item) => item.id === WorkSpaceDrawType)[0];
  if (!workSpaceDraw) return;
  const ratio = currentTemplate.value.height / currentTemplate.value.width;
  let { width, height } = getCanvasSize();
  if (width / zoom.value < mm2px(MinSize)) {
    ElMessage({
      message: t("style.minimumSizeLimit") + MinSize,
      type: "warning",
    });
    width = mm2px(MinSize) * zoom.value;
  }
  if (width / zoom.value > mm2px(MaxSize)) {
    ElMessage({
      message: t("style.maximumSizeLimit") + MaxSize,
      type: "warning",
    });
    width = mm2px(MaxSize) * zoom.value;
  }
  height = isFixed.value ? width * ratio : height;
  workSpaceDraw.set({ width: width / zoom.value, height: height / zoom.value });
  templatesStore.setSize(width, height, zoom.value);
  sizeMode.value = 2;
  canvas.renderAll();
  // resetCanvas()
  addHistorySnapshot();
};

// 修改画布高度
const changeTemplateHeight = () => {
  const [canvas] = useCanvas();
  const workSpaceDraw = canvas
    .getObjects()
    .filter((item) => item.id === WorkSpaceDrawType)[0];
  if (!workSpaceDraw) return;
  const ratio = currentTemplate.value.height / currentTemplate.value.width;
  let { width, height } = getCanvasSize();
  if (height / zoom.value < mm2px(MinSize)) {
    ElMessage({
      message: t("style.minimumSizeLimit") + MinSize,
      type: "warning",
    });
    height = mm2px(MinSize) * zoom.value;
  }
  if (height / zoom.value > mm2px(MaxSize)) {
    ElMessage({
      message: t("style.maximumSizeLimit") + MaxSize,
      type: "warning",
    });
    height = mm2px(MaxSize) * zoom.value;
  }
  width = isFixed.value ? height / ratio : width;
  workSpaceDraw.set({ width: width / zoom.value, height: height / zoom.value });
  templatesStore.setSize(width, height, zoom.value);
  sizeMode.value = 2;
  canvas.renderAll();
  // resetCanvas()
  addHistorySnapshot();
};

// 修改出血尺寸
const changeTemplateClip = async () => {
  templatesStore.setClip(clip.value);
  await templatesStore.renderTemplate();
};

// 修改安全尺寸
const changeTemplateSafe = async () => {
  safe.value = Number(safe.value);
  await templatesStore.renderTemplate();
};

// 修改固定宽高比
const changeFixedRatio = (fixedStatus: boolean) => {
  isFixed.value = fixedStatus;
};

// 修改直角圆角
const changeWorkRound = (roundStatus: boolean) => {
  const [canvas] = useCanvas();
  const workSpaceclip = canvas
    .getObjects()
    .filter(
      (item) => WorkSpaceClipType === item.id && item.isType("Rect")
    )[0] as Rect;
  let rx = 0,
    ry = 0;
  isRound.value = roundStatus;
  if (isRound.value) rx = ry = 10;
  workSpaceclip.set({ rx, ry });
  canvas.renderAll();
};

// 修改尺寸单位
const changeUnitMode = async () => {
  const width = currentTemplate.value.width / currentTemplate.value.zoom;
  const heigth = currentTemplate.value.height / currentTemplate.value.zoom;
  if (unitMode.value === 0) {
    canvasWidth.value = px2mm(width);
    canvasHeight.value = px2mm(heigth);
    clip.value = 2;
    safe.value = 3;
  } else {
    canvasWidth.value = width;
    canvasHeight.value = heigth;
    clip.value = safe.value = 0;
  }
  await changeTemplateClip();
  await changeTemplateSafe();
};

// 应用背景到所有页面
const changeAllBackgroud = () => {
  templatesStore.templates.forEach((item) => {
    item.workSpace = currentTemplate.value.workSpace;
    const currentWorkSpace = currentTemplate.value.objects.filter(
      (ele) => ele.id === WorkSpaceDrawType
    )[0];
    item.objects = item.objects.map((ele) =>
      ele.id === WorkSpaceDrawType ? currentWorkSpace : ele
    );
  });
};

// 加载缓存最近添加的网格
onMounted(() => {
  const recentGridCache = localStorage.getItem(RECENT_GRIDS);
  if (recentGridCache) gridColorRecent.value = JSON.parse(recentGridCache);
});

// 保存缓存最近添加的网格
watch(
  gridColorRecent,
  () => {
    const recentGridCache = JSON.stringify(gridColorRecent.value);
    localStorage.setItem(RECENT_GRIDS, recentGridCache);
  },
  { deep: true }
);

const changeMaskOpacity = () => {
  const [canvas] = useCanvas();
  const workMask = canvas
    .getObjects()
    .filter((ele) => ele.id === WorkSpaceMaskType)[0];
  if (!workMask) return;
  workMask.set("opacity", opacity.value);
  canvas.renderAll();
};
</script>

<style lang="scss" scoped>
.row-info {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  .el-col {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.row-end {
  justify-content: flex-end;
}

.handler-item {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 2px;
  border-radius: $borderRadius;
  font-size: 16px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background: #f1f1f1;
    .icon-down {
      margin-top: 3px;
    }
  }
}
</style>

<style scoped>
:deep(.el-input .el-input-group__prepend) {
  padding: 0 5px;
}
:deep(.el-input .el-input-group__append) {
  padding: 0 5px;
}
:deep(.full-ratio .el-radio-button__inner) {
  width: 100%;
}
:deep(.size-row .el-input-group__prepend) {
  min-width: 14px;
}
</style>