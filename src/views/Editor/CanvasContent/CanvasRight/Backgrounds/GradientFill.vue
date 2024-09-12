<template>
  <svg 
    :width="200 + 'px'"
    :height="30 + 'px'"
    style="border-radius: 5px"
  >
    <defs>
      <linearGradient v-if="type === 'linear'" :id="name"  x1="0%" y1="0%"  x2="100%" y2="0%">
        <stop v-for="item, index in colors" :offset="`${item.offset * 100}` + '%'" :stop-color="item.color" :key="index"/>
      </linearGradient>

      <radialGradient :id="name" v-else>
        <stop v-for="item, index in colors" :offset="`${item.offset * 100}` + '%'" :stop-color="item.color" :key="index" />
      </radialGradient>
    </defs>
    <g :transform="`scale(1,1) translate(0,0) matrix(1,0,0,1,0,0)`">
      <path 
        vector-effect="non-scaling-stroke" 
        stroke-linecap="butt"
        d="M 0 0 L 200 0 L 200 30 L 0 30 Z" 
        :fill="`url(#${name})`"
        stroke-width="1" 
        stroke="#fff"
        stroke-dasharray='0 0'
      ></path>
    </g>
  </svg>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { ColorStop } from '@/types/elements'

defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String as PropType<'linear' | 'radial'>,
  },
  colors: {
    type: Object as PropType<ColorStop[]>,
    required: true,
  },
  rotate: {
    type: Number,
    default: 0,
  },
})
</script>