<template>
  <!-- <div class="element-flip"> -->
    <el-row>
      <el-checkbox-group class="full-group" v-model="handleFlip" @change="changeElementFlip">
        <el-checkbox-button label="flipY">
          <IconFlipVertically />垂直翻转
        </el-checkbox-button>
        <el-checkbox-button label="flipX">
          <IconFlipHorizontally />水平翻转
        </el-checkbox-button>
      </el-checkbox-group>
    </el-row>
    
  <!-- </div> -->
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { ElementNames } from '@/types/elements'
import useCanvas from '@/views/Canvas/useCanvas'
const { canvasObject } = storeToRefs(useMainStore())
const handleFlip = ref<string[]>([])

const handleElement = computed(() => canvasObject.value)

onMounted(() => {
  checkElementFlip()
})

onUnmounted(() => {
  handleFlip.value = []
})

// watch(handleElement, () => {
//   handleFlip.value = []
//   checkElementFlip()
// })

const checkElementFlip = () => {
  if (handleElement.value && (handleElement.value.name === ElementNames.IMAGE || handleElement.value.type === ElementNames.PATH)) {
    if (handleElement.value.flipX && !handleFlip.value.includes('flipX')) {
      handleFlip.value.push('flipX')
    }
    if (handleElement.value.flipY && !handleFlip.value.includes('flipY')) {
      handleFlip.value.push('flipY')
    }
  }
}

const changeElementFlip = (value: string[]) => {
  const [ canvas ] = useCanvas()
  if (handleElement.value && (handleElement.value.name === ElementNames.IMAGE || handleElement.value.type === ElementNames.PATH)) {
    handleElement.value.flipX = value.includes('flipX')
    handleElement.value.flipY = value.includes('flipY')
  }
  canvas.renderAll()
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.full-group {
  display: flex;
  flex: 1;
  .el-checkbox-button {
    width: 50%;
  }
}
</style>
<style scoped>
:deep(.full-group .el-checkbox-button__inner) {
  width: 100%;
}
</style>