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
  [ElementNames.IMAGE]: ImageStylePanel,
  [ElementNames.CROP]: ImageStylePanel,
  [ElementNames.PATH]: PathStylePanel,
  [ElementNames.POLYGON]: PathStylePanel,
  [ElementNames.CIRCLE]: CircleStylePanel,
  [ElementNames.LINE]: LineStylePanel,
  [ElementNames.QRCODE]: QRCodeStylePanel,
  [ElementNames.BARCODE]: BarCodeStylePanel,
  [ElementNames.GROUP]: GroupStylePanel,
  [ElementNames.ACTIVE]: GroupStylePanel,
}

const { canvasObject } = storeToRefs(useMainStore())

const currentPanelComponent = computed(() => {
  if (!canvasObject.value) return null
  if (canvasObject.value.type) {
    //@ts-ignore
    return panelMap[canvasObject.value.type as ElementNames]
  }
  return null
})
</script>