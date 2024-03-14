<template>
  <div>
    <el-popover placement="right" trigger="click" :popper-style="{padding: 0}" width="200" @before-enter="setReference(true)" @hide="setReference(false)" :ref="props.referencePopoverRef" :virtual-ref="props.referenceRef" virtual-triggering>
      <el-row class="reference-pop-row">
        <el-col :span="6" class="reference-pop-text">方向：</el-col>
        <el-col :span="18" class="reference-pop-direction">
          <el-radio-group v-model="direction">
            <el-radio value="vertical" size="small">X 轴</el-radio>
            <el-radio value="horizontal" size="small">Y 轴</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="reference-pop-row">
        <el-col :span="6" class="reference-pop-text">位置：</el-col>
        <el-col :span="18">
          <el-row class="reference-flex-end">
            <el-col :span="10">
              <el-input v-model="distance" size="small"></el-input>
            </el-col>
            <el-col :span="4" class="reference-pop-text reference-flex-end">px</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="reference-pop-btn">
        <el-button size="small" @click="setReference(false)">取消</el-button>
        <el-button size="small" type="primary" @click="addReference">确认</el-button>
      </el-row>
    </el-popover>
  </div>
</template>
<script lang="ts" setup>

import { ref } from 'vue'
import { ReferenceLine } from '@/extension/object/ReferenceLine'
import useCanvas from '@/views/Canvas/useCanvas'

const hasReference = ref(false)
const direction = ref<'horizontal' | 'vertical'>('horizontal')
const distance = ref(0)
const props = defineProps({
  referenceRef: {
    type: null,
  },
  referencePopoverRef: {
    type: null
  }
})

const emit = defineEmits<{
  (event: 'add', payload: { direction: string, distance: number }): void
}>()

const setReference = (val: boolean) => {
  hasReference.value = val
}

const addReference = () => {
  const [ canvas ] = useCanvas()
  const ruler = canvas.ruler
  if (!ruler) return
  const tempReferenceLine = new ReferenceLine(
    distance.value,
    {
      type: 'ReferenceLine',
      axis: direction.value,
      visible: true,
      name: 'ReferenceLine',
      selectable: true,
      hasControls: false,
      hasBorders: false,
      stroke: 'pink',
      fill: 'pink',
      originX: 'center',
      originY: 'center',
      padding: 4,
      globalCompositeOperation: 'difference',
    }
  );
  canvas.add(tempReferenceLine)
  canvas.renderAll()
}

</script>
<style lang="scss" scoped>
.reference-pop-row {
  font-size: 13px;
  padding: 8px 15px ;
  .reference-pop-direction {
    display: flex;
    justify-content: flex-end;
  }
  .reference-pop-text {
    display: flex;
    align-items: center;
  }
  .reference-flex-end {
    justify-content: flex-end;
  }
}
.reference-pop-btn {
  font-size: 13px;
  padding: 8px 15px ;
  justify-content: flex-end;
}
</style>