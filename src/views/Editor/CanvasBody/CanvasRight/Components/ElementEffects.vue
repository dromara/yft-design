<!--
 * @Author: June
 * @Description: 图片描边
 * @Date: 2024-04-12 21:12:06
 * @LastEditors: June
 * @LastEditTime: 2024-04-14 10:25:55
-->
<template>
   <div>
    <el-row>
      <el-col :span="18">
        <el-button size="large" class="full-btn">{{ $t('style.specialEffects') }}</el-button>
      </el-col>
      <el-col :span="6">
        <el-button size="large" class="full-btn btn-right" @click="changeElementEffect">
          <IconTransferData />
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { RightStates } from "@/types/elements";

const { rightState } = storeToRefs(useMainStore())

const changeElementEffect = () => {
  rightState.value = RightStates.ELEMENT_EFFECT
}

</script>

<style lang="scss" scoped>
.full-btn {
  width: 98%;
  .btn-right {
    display: flex;
    justify-content: flex-end;
  }
}
</style>