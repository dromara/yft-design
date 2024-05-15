<template>
  <div>
    <div class="right-tabs">
      <div
        class="tab"
        :class="[
          tab.value === rightState && currentTabs.length > 1
            ? 'active'
            : 'no-active',
        ]"
        v-for="tab in currentTabs"
        :key="tab.value"
        @click="setRightState(tab.value)"
      >
        {{ tab.label }}
      </div>
    </div>
    <div class="right-content">
      <component :is="currentPanelComponent"></component>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, watch } from "vue";
import { RightStates, ElementNames } from "@/types/elements";
import { storeToRefs } from "pinia";
import { useMainStore } from "@/store/modules/main";
import CanvasStylePanel from "./CanvasStylePanel/index.vue";
import ElemnetStylePanel from "./ElementStylePanel/index.vue";
import EffectStylePanel from "./EffectStylePanel/index.vue";
import LayerStylePanel from "./LayerStylePanel/index.vue";
import useI18n from "@/hooks/useI18n";
const { t } = useI18n();

const mainStore = useMainStore();
const { canvasObject, rightState } = storeToRefs(mainStore);

const canvasTabs = [
  { label: t("style.canvas"), value: RightStates.ELEMENT_CANVAS },
  { label: t("style.layer"), value: RightStates.ELEMENT_LAYER },
];
const styleTabs = [
  { label: t("style.style"), value: RightStates.ELEMENT_STYLE },
  { label: t("style.layer"), value: RightStates.ELEMENT_LAYER },
];

const setRightState = (value: RightStates) => {
  mainStore.setRightState(value);
};

const currentTabs = computed(() => {
  if (!canvasObject.value) return canvasTabs;
  if (canvasObject.value.type.toLowerCase() === ElementNames.REFERENCELINE) return canvasTabs;
  return styleTabs;
});

watch(currentTabs, () => {
  const currentTabsValue: RightStates[] = currentTabs.value.map(
    (tab) => tab.value
  );
  if (!currentTabsValue.includes(rightState.value)) {
    mainStore.setRightState(currentTabsValue[0]);
  }
});

const currentPanelComponent = computed(() => {
  const panelMap = {
    [RightStates.ELEMENT_CANVAS]: CanvasStylePanel,
    [RightStates.ELEMENT_STYLE]: ElemnetStylePanel,
    [RightStates.ELEMENT_EFFECT]: EffectStylePanel,
    [RightStates.ELEMENT_LAYER]: LayerStylePanel,
  };
  return panelMap[rightState.value as RightStates.ELEMENT_STYLE];
});
</script>


<style lang="scss" scoped>
.right-tabs {
  height: 40px;
  font-size: 12px;
  flex-shrink: 0;
  display: flex;
  user-select: none;
}
.tab {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $lightGray;
  border-bottom: 1px solid $borderColor;
  cursor: pointer;

  &.active {
    background-color: #fff;
    border-bottom-color: #fff;
  }

  & + .tab {
    border-left: 1px solid $borderColor;
  }
}
.right-content {
  padding: 10px 5px 10px 10px;
  font-size: 13px;
  overflow-y: scroll;
  overflow-x: hidden;
  // @include overflow-overlay();
}
</style>