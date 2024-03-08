<!--
 * @Author: June 1601745371@qq.com
 * @Date: 2024-03-08 11:32:27
 * @LastEditors: June 1601745371@qq.com
 * @LastEditTime: 2024-03-08 11:56:58
 * @FilePath: \github\yft-design\src\components\Lang\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dropdown split-button type="primary" @command="onDropdown">
    {{ lang }}
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="lang in langList" :key="lang.langType" :command="lang.langType">{{ lang.langName }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script name="Lang" lang="ts" setup>
import { ref, computed } from 'vue';
import useI18n from '@/hooks/useI18n'
import { LANG } from '@/constants/key'
import { setLocal } from '@/utils/local';

const { locale, changeLocale }= useI18n()
const LANGMAP: Record<string, string> = {
  zh: '中文',
  en: 'English',
};

const langList = ref(
  Object.keys(LANGMAP).map((key) => ({ langType: key, langName: LANGMAP[key] }))
);

const lang = computed(() => {
  return LANGMAP[locale.value];
});


const onDropdown = (command: string) => {
  changeLocale(command);
  setLocal(LANG, command);
}
</script>