<template>
  <div class="image-style-panel">
    <ElementPosition/>
    <el-divider />
    
    <div class="origin-image" :style="{ backgroundImage: `url(${handleElement.originSrc ? handleElement.originSrc : handleElement.getSrc()})` }"></div>

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
                v-for="(item, key) in CLIPPATHS" 
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
      <FileInput class="full-width-btn" @change="(files: FileList) => replaceImage(files)" >
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
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useTemplatesStore } from '@/store'
import { CLIPPATHS, ClipPathType } from '@/configs/images'
import { ImageElement } from '@/types/canvas'
import { ratioClipOptions } from '@/configs/images'
import { getImageDataURL } from '@/utils/image'
import { propertiesToInclude } from '@/configs/canvas'
import { Image } from 'fabric'
import ElementPosition from '../Components/ElementPosition.vue'
import ElementOutline from '../Components/ElementOutline.vue'
import ElementShadow from '../Components/ElementShadow.vue'
import ElementFlip from '../Components/ElementFlip.vue'
import ElementFilter from '../Components/ElementFilter.vue'
import ElementMask from '../Components/ElementMask.vue'
import useCanvas from '@/views/Canvas/useCanvas'

const mainStore = useMainStore()
const templatesStore = useTemplatesStore()
const [ canvas ] = useCanvas()
const { canvasObject } = storeToRefs(mainStore)
const handleElement = computed(() => canvasObject.value as Image)


// 打开自由裁剪
const clipImage = () => {
  if (!handleElement.value) return
  handleElement.value.set({__isCropping: true, clipPath: undefined, cropPath: undefined})
  canvas.renderAll()
}

// 预设裁剪
const presetImageClip = (key: ClipPathType, ratio = 0) => {
  if (!handleElement.value) return

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
    // const path = CLIPPATHS[key].createPath(200, 200)
    handleElement.value.set({__isCropping: true, _cropKey: key})
    canvas.renderAll()
  }
}

// 替换图片（保持当前的样式）
const replaceImage = (files: FileList) => {
  const imageFile = files[0]
  if (!imageFile) return
  getImageDataURL(imageFile).then(dataURL => {
    const props = { src: dataURL }
    handleElement.value.setSrc(dataURL)
    templatesStore.updateElement({ id: handleElement.value.id, props })
  })
  
}

// 重置图片：清除全部样式
const resetImage = () => {
  handleElement.value.filters = []
  handleElement.value.applyFilters()
  // @ts-ignore
  const props = handleElement.value.toObject(propertiesToInclude) as ImageElement
  templatesStore.updateElement({ id: props.id, props})

  
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