<template>
  <div>
    <div class="left-top-tabs" id="left-top-tabs">
      <div class="top-tab">
        <IconAllApplication class="handler-item" ref="menuRef" />
        <HomePopover :menu-ref="menuRef" :menu-popover-ref="menuPopoverRef" />
      </div>
    </div>
    <div class="left-bottom-tabs">
      <div class="center-tabs">
        <div class="center-tab" :class="{ 'left-active': tab.key === poolType }" v-for="tab in topTabs" :key="tab.key" @click="setPoolType(tab.key)">
          <div :id="`left-tabs-${tab.key}`">
            <div><SvgIcon :icon-class="tab.icon" className="svg-size" /></div>
            <div class="left-name">{{ $t(tab.label) }}</div>
          </div>
        </div>
      </div>
      <div class="bottom-tabs">
        <div class="bottom-tab" :class="{ 'left-active': 'layer' === poolType }" @click="setPoolType('layer')">
          <div :id="`left-tabs-layer`">
            <div><SvgIcon icon-class="layer" className="svg-size" /></div>
            <div class="left-name">{{ $t("message.layer") }}</div>
          </div>
        </div>
        <div class="bottom-tab" :class="{ 'left-active': 'help' === poolType }" ref="helpRef" @click="setPoolType('help')">
          <div :id="`left-tabs-help`">
            <div><SvgIcon icon-class="help" className="svg-size" /></div>
            <div class="left-name">{{ $t("message.help") }}</div>
          </div>
        </div>
        <HelpPopover :help-ref="helpRef" :help-popover-ref="helpPopoverRef" />
        <HotkeyDrawer :has-hotkey="hasHotkey" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/store";
import { PoolType } from "@/types/common";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import HotkeyDrawer from "./components/HotkeyDrawer.vue";
import HelpPopover from "./components/HelpPopover.vue";
import HomePopover from "./components/HomePopover.vue";

const mainStore = useMainStore();
const { poolType, poolShow } = storeToRefs(mainStore);

const helpRef = ref();
const menuRef = ref();
const helpPopoverRef = ref();
const menuPopoverRef = ref();
const hasHotkey = ref(false);

interface TabItem {
  key: PoolType;
  label: string;
  icon: string;
  index: number;
}

const topTabs: TabItem[] = [
  { key: "editor", label: "message.edit", icon: `editor`, index: 0 },
  { key: "template", label: "message.template", icon: `template`, index: 1 },
  { key: "material", label: "message.material", icon: `material`, index: 2 },
  { key: "text", label: "message.text", icon: "text", index: 3 },
  { key: "image", label: "message.image", icon: "picture", index: 4 },
  { key: "toolkit", label: "message.tool", icon: "toolkit", index: 5 },
];

const setPoolType = (tab: PoolType) => {
  if (poolShow.value && tab === poolType.value) {
    poolShow.value = false;
  } else {
    poolShow.value = tab !== "editor" && tab !== "help" ? true : false;
  }
  mainStore.setPoolType(tab);
};
</script>

<style lang="scss" scoped>
.top-tab {
  width: 100%;
  height: 40px;
  text-align: center;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid $borderColor;
  .handler-item {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 2px;
    border-radius: $borderRadius;

    &:not(.group-btn):hover {
      background-color: #f1f1f1;
    }
  }
}
.center-tabs {
  overflow-y: scroll;
  overflow-x: hidden;
  height: calc(100vh - 160px);
}
.center-tab {
  width: 100%;
  height: 60px;
  padding-left: 2px;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;

  .left-icon {
    font-size: 20px;
  }
}
.left-active {
  color: $themeColor;
}
.left-name {
  font-size: 14px;
  line-height: 1.2;
}
.svg-size {
  font-size: 20px;
}
.left-active::before {
  background-color: $themeColor;
  border-radius: 4px;
  content: "";
  height: 41px;
  left: -3px;
  position: absolute;
  transition: top 0.2s;
  width: 6px;
  z-index: 20;
}
.left-content {
  position: relative;
  width: 300px;
  left: 50px;
  top: -360px;
  height: 100%;
  z-index: 1;
  background: #fff;
  border-left: 1px solid $borderColor;
  border-right: 1px solid $borderColor;
  transition: left 0.5s linear, right 0.5s linear;
}
.left-close {
  cursor: default;
  left: -320px;
  position: relative;
  top: 50%;
  // z-index: 1;
}
.layout-toggle {
  background: $themeColor;
  cursor: pointer;
  height: 88px;
  position: absolute;
  right: -16px;
  top: 50%;
  transform: translateY(-50%);
  transition: right 0.1s linear;
  width: 16px;
  z-index: 1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  display: flex;
  align-items: center;
  border-top: 1px solid $borderColor;
  border-bottom: 1px solid $borderColor;
  border-right: 1px solid $borderColor;
}
.bottom-tabs {
  position: absolute;
  bottom: 0;
  width: 49px;
  z-index: 30;
}
.bottom-tab {
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #fff;
  position: relative;

  .help-handle {
    font-size: 20px;
  }
  #left-tabs-help,
  #left-tabs-layer {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
.has-help {
  color: $themeColor;
}
.help-pop-row {
  font-size: 15px;
  padding: 10px 25px;
  cursor: pointer;
  .help-pop-icon {
    font-size: 20px;
  }

  .help-pop-text {
    padding-left: 10px;
  }
}
.help-pop-row:hover {
  background-color: $hoverColor;
}
</style>
