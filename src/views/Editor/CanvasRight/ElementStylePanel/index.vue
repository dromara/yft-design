<template>
  <div class="element-style-panel">
    <component :is="currentPanelComponent"></component>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { ElementNames } from '@/types/elements'

import TextboxStylePanel from './TextboxStylePanel.vue'
import ImageStylePanel from './ImageStylePanel.vue'
import PathStylePanel from './PathStylePanel.vue'
import CircleStylePanel from './CircleStylePanel.vue'
import LineStylePanel from './LineStylePanel.vue'
import QRCodeStylePanel from './QRCodeStylePanel.vue'
import BarCodeStylePanel from './BarCodeStylePanel.vue'
import GroupStylePanel from './GroupStylePanel.vue'

const panelMap = {
  [ElementNames.TEXTBOX]: TextboxStylePanel,
  [ElementNames.TEXT]: TextboxStylePanel,
  [ElementNames.ITEXT]: TextboxStylePanel,
  [ElementNames.IMAGE]: ImageStylePanel,
  [ElementNames.CROPIMAGE]: ImageStylePanel,
  [ElementNames.PATH]: PathStylePanel,
  [ElementNames.RECT]: PathStylePanel,
  [ElementNames.ELLIPSE]: PathStylePanel,
  [ElementNames.POLYLINE]: PathStylePanel,
  [ElementNames.CIRCLE]: CircleStylePanel,
  [ElementNames.LINE]: LineStylePanel,
  [ElementNames.ARROW]: LineStylePanel,
  [ElementNames.QRCODE]: QRCodeStylePanel,
  [ElementNames.BARCODE]: BarCodeStylePanel,
  [ElementNames.GROUP]: GroupStylePanel,
  [ElementNames.ACTIVE]: GroupStylePanel,
}

const { canvasObject } = storeToRefs(useMainStore())

const currentPanelComponent = computed(() => {
  if (!canvasObject.value) return null
  console.log('canvasObject:', canvasObject.value.id)
  const canvasType = canvasObject.value.name ? canvasObject.value.name : canvasObject.value.type
  return panelMap[canvasType.toLowerCase() as ElementNames.TEXT]
})
</script>