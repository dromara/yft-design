<template>
<el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="文字水印" name="TextWatermark">
        <div>
          <div class="setting-item">
            <span class="mr-10px">{{ $t('waterMark.setting.name') }}</span>
            <el-input
              class="w-320"
              v-model="waterMarkState.text"
              maxlength="15"
              show-word-limit
            />
          </div>
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
          <div class="setting-item">
            <span class="mr-10px">{{ $t('waterMark.setting.size') }}</span>

            <el-slider class="w-320" v-model="waterMarkState.size" :min="18" :max="48"></el-slider>
          </div>
          <div class="setting-item">
            <span class="mr-10px">{{ $t('waterMark.setting.position.label') }}</span>

            <el-radio-group v-model="waterMarkState.position">
              <el-radio label="lt">{{ $t('waterMark.setting.position.lt') }}</el-radio>
              <el-radio label="rt">{{ $t('waterMark.setting.position.rt') }}</el-radio>
              <el-radio label="lb">{{ $t('waterMark.setting.position.lb') }}</el-radio>
              <el-radio label="rb">{{ $t('waterMark.setting.position.rb') }}</el-radio>
              <el-radio label="full">{{ $t('waterMark.setting.position.full') }}</el-radio>
            </el-radio-group>
          </div>
          <div class="setting-item" v-show="waterMarkState.position === 'full'">
            <span class="mr-10px">{{ $t('waterMark.setting.angle') }}</span>

            <div>
              <el-radio-group v-model="waterMarkState.isRotate">
                <el-radio :label="0">横向</el-radio>
                <el-radio :label="1">倾斜</el-radio>
              </el-radio-group>
            </div>
          </div>
          <el-button type="primary" size="mini" @click="onModalOk">{{ $t('default.ok') }}</el-button>
        </div>
      </el-collapse-item>
</el-collapse>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { debounce } from 'lodash-es';
// import useSelect from '@/hooks/select';
// import { useFont } from '@/hooks';
import useCanvas from "@/views/Canvas/useCanvas";
import { WorkSpaceThumbType, WorkSpaceDrawType } from "@/configs/canvas"
import { ElementNames } from "@/types/elements";
import { Image } from 'fabric'
import { nanoid } from "nanoid";


const activeNames = ref(['TextWatermark'])
const handleChange = (val: string[]) => {
  console.log(val)
}

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

// const showWaterMadal = ref(false);
// const onMadalCancel = () => {
//   waterMarkState.text = '';
//   waterMarkState.size = 24;
//   waterMarkState.fontFamily = 'serif';
//   waterMarkState.color = '#ccc';
//   waterMarkState.position = 'lt';
//   waterMarkState.isRotate = 0;
// };

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

const onModalOk = async () => {
  // if (!waterMarkState.text) return Message.warning('水印名字不能为空');
  if (!waterMarkState.text) return
  const [ canvas ] = useCanvas()
  const workspace = canvas.getObjects().find((item: any) => item.id === WorkSpaceDrawType);
  console.log('workspace', workspace);
  console.log('canvas', canvas);
  
  const { width, height, left, top } = workspace;
  drawWaterMark[waterMarkState.position](width, height, async (imgString: string) => {
    canvas.overlayImage = await Image.fromURL(imgString, {
      id: nanoid(10),
      crossOrigin: 'anonymous',
      left: left,
      top: top,
      angle: waterMarkState.isRotate === 1 ? 30 : 0,
      hasControls: true,
      hasBorders: true,
      opacity: 1,
      originX: "left",
      originY: "top",
      name: ElementNames.IMAGE,
      crossOrigin: "anonymous",
    }); // 清空覆盖层
    canvas.renderAll()
  });
};

const changeFontFamily = (fontName: string) => {
  if (!fontName) return;
  // loadFont(fontName);
};

// const addWaterMark = debounce(function () {
//   showWaterMadal.value = true;
// }, 250);


</script>

<style lang="scss" scoped>

</style>