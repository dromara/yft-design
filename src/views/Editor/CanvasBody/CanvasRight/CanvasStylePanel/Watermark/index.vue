<template>
  <el-row>
    <div>
      <div class="title">
        <b>{{ t("waterMark.text") }}</b>
      </div>
      <el-row class="mt-[10px]">
        <el-col :span="5" class="flex items-center">{{ t('waterMark.setting.name') }}</el-col>
        <!-- <span class="mr-10px"></span> -->
        <el-col :span="19">
          <el-input class="w-320" v-model="waterMarkState.text" maxlength="15" show-word-limit type="textarea" autosize/>
        </el-col>
        
      </el-row >
      <!-- <div class="setting-item font-selector">
        <span class="mr-10px">选择字体</span>
        <Select class="w-320" v-model="waterMarkState.fontFamily" @on-change="changeFontFamily">
          <Option v-for="item in fontsList" :value="item.name" :key="`font-${item.name}`">
            <div class="font-item" v-if="!item.preview">{{ item.name }}</div>
            <div class="font-item" v-else :style="`background-image:url('${item.preview}');`">
              {{ !item.preview ? item : '' }}
              <span style="display: none">{{ item.name }}</span>
            </div>
          </Option>
        </Select>
      </div> -->
      <el-row class="mt-[10px]">
        <el-col :span="5" class="flex items-center">{{ t('waterMark.setting.size') }}</el-col>
        <el-col :span="19">
          <el-slider class="w-11/12" v-model="waterMarkState.size" :min="18" :max="48"></el-slider>
        </el-col>
      </el-row>
      <el-row class="mt-[10px]">
        <el-col :span="5" class="flex items-center">{{ t('waterMark.setting.position.label') }}</el-col>
        <el-col :span="19">
          <el-radio-group v-model="waterMarkState.position" class="w-full">
            <el-radio-button value="lt" class="w-1/5">
              <IconLeftSmallUp />
              <!-- {{ t('waterMark.setting.position.lt') }} -->
            </el-radio-button>
            <el-radio-button value="rt" class="w-1/5">
              <IconRightSmallUp />
              <!-- {{ t('waterMark.setting.position.rt') }} -->
            </el-radio-button>
            <el-radio-button value="lb" class="w-1/5">
              <IconLeftSmallDown />
              <!-- {{ t('waterMark.setting.position.lb') }} -->
            </el-radio-button>
            <el-radio-button value="rb" class="w-1/5">
              <IconRightSmallDown />
              <!-- {{ t('waterMark.setting.position.rb') }} -->
            </el-radio-button>
            <el-radio-button value="full" class="w-1/5">
              <IconFullScreen />
              <!-- {{ t('waterMark.setting.position.full') }} -->
            </el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <div class="mt-[10px]" v-show="waterMarkState.position === 'full'">
        <span class="mr-10px">{{ t('waterMark.setting.angle') }}</span>
        <div>
          <el-radio-group v-model="waterMarkState.isRotate">
            <el-radio :value="0">横向</el-radio>
            <el-radio :value="1">倾斜</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="mt-[10px]">
        <el-button-group class="w-full">
          <el-button @click="remWaterMark" class="w-1/2">{{ t('default.cleanUp')}}</el-button>
          <el-button @click="addWaterMark" class="w-1/2">{{ t('default.ok') }}</el-button>
        </el-button-group>
      </div>
    </div>
  </el-row>
</template>

<script lang="ts" setup>
import useCanvas from "@/views/Canvas/useCanvas";
import useI18n from "@/hooks/useI18n";
import { ref, reactive } from 'vue'
import { debounce } from 'lodash-es';
import { WorkSpaceThumbType, WorkSpaceDrawType } from "@/configs/canvas"
import { ElementNames } from "@/types/elements";
import { Image } from 'fabric'
import { nanoid } from "nanoid";
import { ElMessage } from 'element-plus'

const { t } = useI18n();
const activeNames = ref(['TextWatermark'])


// const { fontsList, loadFont } = useFont();
// const { canvasEditor }: any = useSelect();
const waterMarkState = reactive({
  text: '',
  size: 24,
  isRotate: 0, // 组件不支持boolean
  fontFamily: '汉体', // 可考虑自定义字体
  color: '#ccc', // 可考虑自定义颜色
  position: 'lt', // lt 左上 lr 右上 lb 左下  rb 右下 full 平铺
});

const createCanvas = (width: number, height: number) => {
  const waterCanvas = document.createElement('canvas');
  waterCanvas.width = width;
  waterCanvas.height = height;
  waterCanvas.style.position = 'fixed';
  waterCanvas.style.opacity = '0';
  waterCanvas.style.zIndex = '-1';
  return waterCanvas;
};

const drawWaterMark: Record<string, any> = {
  lt: (width: number, height: number, cb: (imgString: string) => void) => {
    let waterCanvas: HTMLCanvasElement | null = createCanvas(width, height);
    const w = waterCanvas.width || width;
    let ctx: CanvasRenderingContext2D | null = waterCanvas.getContext('2d')!;
    ctx.fillStyle = waterMarkState.color;
    ctx.font = `${waterMarkState.size}px ${waterMarkState.fontFamily}`;
    ctx.fillText(waterMarkState.text, 10, waterMarkState.size + 10, w - 20);
    cb && cb(waterCanvas.toDataURL());
    waterCanvas = null;
    ctx = null;
  },
  rt: (width: number, height: number, cb: (imgString: string) => void) => {
    let waterCanvas: HTMLCanvasElement | null = createCanvas(width, height);
    let ctx: CanvasRenderingContext2D | null = waterCanvas.getContext('2d')!;
    const w = waterCanvas.width || width;
    ctx.fillStyle = waterMarkState.color;
    ctx.font = `${waterMarkState.size}px ${waterMarkState.fontFamily}`;
    ctx.fillText(
      waterMarkState.text,
      w - ctx.measureText(waterMarkState.text).width - 20,
      waterMarkState.size + 10,
      w - 20
    );
    cb && cb(waterCanvas.toDataURL());
    waterCanvas = null;
    ctx = null;
  },
  lb: (width: number, height: number, cb: (imgString: string) => void) => {
    let waterCanvas: HTMLCanvasElement | null = createCanvas(width, height);
    let ctx: CanvasRenderingContext2D | null = waterCanvas.getContext('2d')!;
    const w = waterCanvas.width || width;
    const h = waterCanvas.height || height;
    ctx.fillStyle = waterMarkState.color;
    ctx.font = `${waterMarkState.size}px ${waterMarkState.fontFamily}`;
    ctx.fillText(waterMarkState.text, 10, h - waterMarkState.size, w - 20);
    cb && cb(waterCanvas.toDataURL());
    waterCanvas = null;
    ctx = null;
  },
  rb: (width: number, height: number, cb: (imgString: string) => void) => {
    let waterCanvas: HTMLCanvasElement | null = createCanvas(width, height);
    let ctx: CanvasRenderingContext2D | null = waterCanvas.getContext('2d')!;
    const w = waterCanvas.width || width;
    ctx.fillStyle = waterMarkState.color;
    ctx.font = `${waterMarkState.size}px ${waterMarkState.fontFamily}`;
    ctx.fillText(
      waterMarkState.text,
      w - ctx.measureText(waterMarkState.text).width - 20,
      height - waterMarkState.size,
      width - 20
    );
    cb && cb(waterCanvas.toDataURL());
    waterCanvas = null;
    ctx = null;
  },
  full: (width: number, height: number, cb: (imgString: string) => void) => {
    let waterCanvas: HTMLCanvasElement | null = createCanvas(width, height);
    let ctx: CanvasRenderingContext2D | null = waterCanvas.getContext('2d')!;
    const textW = ctx.measureText(waterMarkState.text).width + 40;
    let patternCanvas: HTMLCanvasElement | null = createCanvas(
      waterMarkState.isRotate === 0 ? textW : textW * 2, // 若有倾斜，那么斜边都会大于直角边 按30度算2倍(简单)
      waterMarkState.isRotate === 0 ? waterMarkState.size + 20 : textW + 20
    );
    document.body.appendChild(patternCanvas);
    let ctxWater: CanvasRenderingContext2D | null = patternCanvas.getContext('2d')!;
    ctxWater.textAlign = 'left';
    ctxWater.textBaseline = 'top';
    ctxWater.font = `${waterMarkState.size}px ${waterMarkState.fontFamily}`;
    ctxWater.fillStyle = `${waterMarkState.color}`;
    if (waterMarkState.isRotate === 0) {
      ctxWater.fillText(waterMarkState.text, 10, 10);
    } else {
      ctxWater.translate(0, textW - 10);
      ctxWater.rotate((-30 * Math.PI) / 180); // 简单例子 按30度算
      ctxWater.fillText(waterMarkState.text, 0, 0);
    }
    ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat')!;
    ctx.fillRect(0, 0, width, height);
    cb && cb(waterCanvas.toDataURL());
    waterCanvas = null;
    patternCanvas = null;
    ctx = null;
    ctxWater = null;
  },
};

// 添加水印
const addWaterMark = async () => {
  if (!waterMarkState.text) return ElMessage({
    type: 'warning',
    message: '水印名称不能为空'
  })
  const [ canvas ] = useCanvas()
  const workspace = canvas.getObjects().find((item: any) => item.id === WorkSpaceDrawType);
  const { width, height, left, top } = workspace;
  drawWaterMark[waterMarkState.position](width, height, async (imgString: string) => {
    canvas.overlayImage = await Image.fromURL(imgString, {}, {
      id: nanoid(10),
      crossOrigin: 'anonymous',
      left: left,
      top: top,
      angle: waterMarkState.isRotate === 1 ? 30 : 0,
    }); // 清空覆盖层
    canvas.renderAll()
  });
};

// 清除水印
const remWaterMark = () => {
  const [ canvas ] = useCanvas()
  canvas.set({overlayImage: null})
  canvas.renderAll()
}


</script>

<style lang="scss" scoped>

</style>

<style scoped>
:deep(.w-full .el-radio-button__inner) {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>