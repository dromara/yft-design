<template>
  <div class="image-style-panel">
    <div 
      class="origin-image"
      :style="{ backgroundImage: `url(${handleElement.getSrc()})` }"
    ></div>

    <ElementFlip />

    <el-row class="mt-10">
      <el-button-group class="clip-image">
        <el-button class="clip-button" @click="clipImage">
          <IconTailoring class="btn-icon" /> 裁剪图片
        </el-button>
        <el-popover trigger="click" width="284">
          <template #reference>
            <el-button><IconDown /></el-button>
          </template>
          <div class="clip">
            <div class="title">按形状：</div>
            <div class="shape-clip">
              <div 
                class="shape-clip-item" 
                v-for="(item, key) in shapeClipPathOptions" 
                :key="key"
                @click="presetImageClip(key)"
              >
                <div class="shape" :style="{ clipPath: item.style }"></div>
              </div>
            </div>

            <template v-for="type in ratioClipOptions" :key="type.label">
              <div class="title" v-if="type.label">按{{type.label}}：</div>
              <el-button-group class="row">
                <el-button 
                  style="flex: 1;"
                  v-for="item in type.children"
                  :key="item.key"
                  @click="presetImageClip('rect', item.ratio)"
                >{{item.key}}</el-button>
              </el-button-group>
            </template>
          </div>
        </el-popover>
      </el-button-group>
    </el-row>

    <el-divider />
    <ElementMask />
    <el-divider />
    <ElementFilter />
    <el-divider />
    <ElementOutline />
    <el-divider />
    <ElementShadow />
    <el-divider />
    
    <el-row>
      <FileInput class="full-width-btn" @change="files => replaceImage(files)" >
        <el-button class="full-btn"><IconTransform class="btn-icon" /> 替换图片</el-button>
      </FileInput>
    </el-row>
    <el-row>
      <el-button class="full-width-btn" @click="resetImage()"><IconUndo class="btn-icon" /> 重置样式</el-button>
    </el-row>
    <el-row>
      <el-button class="full-width-btn" @click="setBackgroundImage()"><IconTheme class="btn-icon" /> 设为背景</el-button>
    </el-row>
    
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useTemplatesStore, useFabricStore } from '@/store'
import { CLIPPATHS } from '@/configs/imageClip'
import { ImageElement } from '@/types/canvas'
import ElementOutline from '../Components/ElementOutline.vue'
import ElementShadow from '../Components/ElementShadow.vue'
import ElementFlip from '../Components/ElementFlip.vue'
import ElementFilter from '../Components/ElementFilter.vue'
import ElementMask from '../Components/ElementMask.vue'
import { ratioClipOptions } from '@/configs/images'
import useCanvas from '@/views/Canvas/useCanvas'
import { ElementNames } from '@/types/elements'
import useCanvasZindex from '@/hooks/useCanvasZindex'
import { getImageDataURL } from '@/utils/image'
import { toObjectFilter, WorkSpaceName } from '@/configs/canvas'
import { extendWithCropImage } from '@/extension/mixins/cropping.mixin'

const shapeClipPathOptions = CLIPPATHS

const mainStore = useMainStore()
const fabricStore = useFabricStore()
const templatesStore = useTemplatesStore()
const [ canvas ] = useCanvas()
const { canvasObject } = storeToRefs(mainStore)
const { isCropping } = storeToRefs(fabricStore)
const { setZindex } = useCanvasZindex()
const handleElement = computed(() => canvasObject.value as ImageElement)


// 打开自由裁剪
const clipImage = () => {
  if (!handleElement.value || handleElement.value.type !== ElementNames.CROPIMAGE || isCropping.value) return
  extendWithCropImage(handleElement.value)
  handleElement.value.isCropping = true
}

// const addImageMask = (imageElement: ImageElement, cropElement: CropElement) => {
//   const imageLeft = imageElement.left ? imageElement.left : 0, imageTop = imageElement.top ? imageElement.top : 0
//   const imageWidth = imageElement.width ? imageElement.width : 0, imageHeight = imageElement.height ? imageElement.height : 0
//   const innerLeftPoint = cropElement.getPointByOrigin('left', 'top')
//   const interRIghtPoint = cropElement.getPointByOrigin('right', 'bottom')

//   const outerLeftPoint = imageElement.getPointByOrigin('left', 'top')
//   const outerRightPoint = imageElement.getPointByOrigin('right', 'bottom')

//   const maskPath = `
//   M${outerLeftPoint.x} ${outerLeftPoint.y} 
//   L${outerRightPoint.x} ${outerLeftPoint.y} 
//   L${outerRightPoint.x} ${outerRightPoint.y} 
//   L${outerLeftPoint.x} ${outerRightPoint.y} 
//   L${outerLeftPoint.x} ${outerLeftPoint.y} Z 

//   M${innerLeftPoint.x} ${innerLeftPoint.y} 
//   L${interRIghtPoint.x} ${innerLeftPoint.y} 
//   L${interRIghtPoint.x} ${interRIghtPoint.y} 
//   L${innerLeftPoint.x} ${interRIghtPoint.y} 
//   L${innerLeftPoint.x} ${innerLeftPoint.y} Z`
//   const cropMask = new fabric.Path(maskPath, {
//     left: imageLeft - imageWidth / 2,
//     top: imageTop - imageHeight / 2,
//     name: 'mask',
//     fill: 'pink',
//     opacity: 0.9,
//     selectable: false,
//     evented: false,
//     originX: 'left',
//     originY: 'top',
//   })
//   canvas.add(cropMask)
//   canvas.renderAll()
//   setZindex(canvas)
// }

// 预设裁剪
const presetImageClip = (shape: string, ratio = 0) => {
  const _handleElement = handleElement.value

  // 纵横比裁剪（形状固定为矩形）
  if (ratio) {
    // const imageRatio = originHeight / originWidth

    // const min = 0
    // const max = 100
    // let range: [[number, number], [number, number]]

    // if (imageRatio > ratio) {
    //   const distance = ((1 - ratio / imageRatio) / 2) * 100
    //   range = [[min, distance], [max, max - distance]]
    // }
    // else {
    //   const distance = ((1 - imageRatio / ratio) / 2) * 100
    //   range = [[distance, min], [max - distance, max]]
    // }
    // ({
    //   id: handleElementId.value,
    //   props: {
    //     clip: { ..._handleElement.clip, shape, range },
    //     left: originLeft + originWidth * (range[0][0] / 100),
    //     top: originTop + originHeight * (range[0][1] / 100),
    //     width: originWidth * (range[1][0] - range[0][0]) / 100,
    //     height: originHeight * (range[1][1] - range[0][1]) / 100,
    //   },
    // })
  }
  // 形状裁剪（保持当前裁剪范围）
  else {
    // ({
    //   id: handleElementId.value,
    //   props: {
    //     clip: { ..._handleElement.clip, shape, range: originClipRange }
    //   },
    // })
  }
  // clipImage()
  // 
}

// 替换图片（保持当前的样式）
const replaceImage = (files: FileList) => {
  const imageFile = files[0]
  if (!imageFile) return
  getImageDataURL(imageFile).then(dataURL => {
    const props = { src: dataURL }
    handleElement.value.setSrc(dataURL)
    // @ts-ignore
    templatesStore.updateElement({ id: handleElement.value.id, props })
  })
  
}

// 重置图片：清除全部样式
const resetImage = () => {
  handleElement.value.filters = []
  handleElement.value.applyFilters()
  // @ts-ignore
  const props = handleElement.value.toObject(toObjectFilter)
  templatesStore.updateElement({ id: props.id,  props})

  
}

// 将图片设置为背景
const setBackgroundImage = () => {
  // const _handleElement = handleElement.value as PPTImageElement

  // const background: SlideBackground = {
  //   ...currentSlide.value.background,
  //   type: 'image',
  //   image: _handleElement.src,
  //   imageSize: 'cover',
  // }
  // slidesStore.updateSlide({ background })
  // 
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.switch-wrapper {
  text-align: right;
}
.origin-image {
  height: 100px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: $lightGray;
  margin-bottom: 10px;
}
.full-width-btn {
  width: 100%;
  margin-bottom: 10px;
}
.full-btn {
  width: 100%;
}
.btn-icon {
  margin-right: 3px;
}

.clip {
  width: 260px;
  font-size: 12px;

  .title {
    margin-bottom: 5px;
  }
}
.shape-clip {
  margin-bottom: 10px;

  @include flex-grid-layout();
}
.shape-clip-item {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  @include flex-grid-layout-children(5, 16%);

  &:hover .shape {
    background-color: #ccc;
  }

  .shape {
    width: 40px;
    height: 40px;
    background-color: #e1e1e1;
  }
}
.clip-image {
  display: flex;
  flex: 1;
  .clip-button {
    width: 100%;
  }
}
.mt-10 {
  margin-top: 10px;
}
</style>