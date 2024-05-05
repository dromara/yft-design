<template>
  <div class="fs-virtual-waterfall-container" ref="containerRef" >
    <div class="fs-virtual-waterfall-list" :style="listStyle">
      <div
        v-if="isShow"
        class="fs-virtual-waterfall-item"
        v-for="{ item, style, imageHeight } in renderList"
        :key="item.id"
        :style="style"
      >
        <slot name="item" :item="item" :imageHeight="imageHeight"></slot>
      </div>
      <div id="temporary-list" v-else>
        <div v-for="{ item, style, imageHeight } in temporaryList" :style="style">
          <slot name="item" :item="item" :imageHeight="imageHeight"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties, computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import type { IVirtualWaterFallProps, ICardItem, IBookColumnQueue, IBookRenderItem, IBookItemRect } from "@/types/templates";
// import { debounce, rafThrottle } from "./tool";
import { useTemplatesStore } from '@/store'
import { storeToRefs } from "pinia";
const { dataState, scrollState, itemSizeInfo, containerRef } = storeToRefs(useTemplatesStore())
const props = defineProps<IVirtualWaterFallProps>();

defineSlots<{
  item(props: { item: ICardItem; imageHeight: number }): any;
}>();


function rafThrottle(fn: Function) {
  let lock = false;
  return function (this: any, ...args: any[]) {
    if (lock) return;
    lock = true;
    window.requestAnimationFrame(() => {
      fn.apply(this, args);
      lock = false;
    });
  };
}

function debounce(fn: Function, delay: number = 300) {
  let timer: number | null = null;
  return function (this: any, ...args: any[]) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// const containerRef = ref<HTMLDivElement | null>(null);

const resizeObserver = new ResizeObserver(() => {
  handleResize();
});

// const dataState = reactive({
//   loading: false,
//   isFinish: false,
//   currentPage: 1,
//   list: [] as ICardItem[],
// });
const dataStateRef = reactive(dataState.value)

// const scrollState = reactive({
//   viewWidth: 0,
//   viewHeight: 0,
//   start: 0,
// });

const queueState = reactive({
  queue: new Array(props.column).fill(0).map<IBookColumnQueue>(() => ({ list: [], height: 0 })),
  len: 0,
});

const hasMoreData = computed(() => queueState.len < dataStateRef.list.length);

const temporaryList = ref<IBookRenderItem[]>([]);

const isShow = ref(false);

// const itemSizeInfo = ref(new Map<ICardItem["id"], IBookItemRect>());

const end = computed(() => scrollState.value.viewHeight + scrollState.value.start);

const cardList = computed(() => queueState.queue.reduce<IBookRenderItem[]>((pre, { list }) => pre.concat(list), []));

const renderList = computed(() => cardList.value.filter((i) => i.h + i.y > scrollState.value.start && i.y < end.value));

const computedHeight = computed(() => {
  let minIndex = 0,
    minHeight = Infinity,
    maxHeight = -Infinity;
  queueState.queue.forEach(({ height }, index) => {
    if (height < minHeight) {
      minHeight = height;
      minIndex = index;
    }
    if (height > maxHeight) {
      maxHeight = height;
    }
  });
  return {
    minIndex,
    minHeight,
    maxHeight,
  };
});

const listStyle = computed(() => ({ height: `${computedHeight.value.maxHeight}px` } as CSSProperties));

watch(
  () => props.column,
  () => {
    handleResize();
  }
);

const setItemSize = () => {
  itemSizeInfo.value = dataStateRef.list.reduce<Map<ICardItem["id"], IBookItemRect>>((pre, current) => {
    const itemWidth = Math.floor((scrollState.value.viewWidth - (props.column - 1) * props.gap) / props.column);
    const rect = itemSizeInfo.value.get(current.id);
    pre.set(current.id, {
      width: itemWidth,
      height: rect ? rect.height : 0,
      imageHeight: Math.floor((itemWidth * current.height) / current.width),
    });
    return pre;
  }, new Map());
};

const updateItemSize = () => {
  temporaryList.value.forEach(({ item, h }) => {
    const rect = itemSizeInfo.value.get(item.id)!;
    itemSizeInfo.value.set(item.id, { ...rect, height: h });
  });
};

const addInQueue = (size = props.enterSize) => {
  for (let i = 0; i < size!; i++) {
    const minIndex = computedHeight.value.minIndex;
    const currentColumn = queueState.queue[minIndex];
    const before = currentColumn.list[currentColumn.list.length - 1] || null;
    const dataItem = dataStateRef.list[queueState.len];
    const item = generatorItem(dataItem, before, minIndex);
    currentColumn.list.push(item);
    currentColumn.height += item.h;
    queueState.len++;
  }
};

const generatorItem = (item: ICardItem, before: IBookRenderItem | null, index: number): IBookRenderItem => {
  const rect = itemSizeInfo.value.get(item.id)!;
  const width = rect.width;
  const height = rect.height;
  const imageHeight = rect.imageHeight;
  let y = 0;
  if (before) y = before.y + before.h + props.gap;
  return {
    item,
    y,
    h: height,
    imageHeight,
    style: {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate3d(${index === 0 ? 0 : (width + props.gap) * index}px, ${y}px, 0)`,
    },
  };
};

const loadDataList = async () => {
  if (dataStateRef.isFinish) return;
  dataStateRef.loading = true;
  const list = await props.request(dataStateRef.currentPage++, props.pageSize);
  if (!list.length) {
    dataStateRef.isFinish = true;
    return;
  }
  dataStateRef.list.push(...list);
  dataStateRef.loading = false;
  return list.length;
};

// const handleScroll = rafThrottle(() => {
//   const { scrollTop, clientHeight } = containerRef.value!;
//   scrollState.start = scrollTop;
//   if (!dataStateRef.loading && !hasMoreData.value) {
//     loadDataList().then((len) => {
//       len && setItemSize();
//       len && mountTemporaryList();
//     });
//     return;
//   }
//   if (scrollTop + clientHeight > computedHeight.value.minHeight) {
//     mountTemporaryList();
//   }
// });

const handleResize = debounce(() => {
  initScrollState();
  reComputedQueue();
}, 300);

const reComputedQueue = () => {
  setItemSize();
  queueState.queue = new Array(props.column).fill(0).map<IBookColumnQueue>(() => ({ list: [], height: 0 }));
  queueState.len = 0;
  containerRef.value!.scrollTop = 0;
  mountTemporaryList(props.pageSize);
};

const mountTemporaryList = (size = props.enterSize) => {
  if (!hasMoreData.value) return;
  isShow.value = false;
  for (let i = 0; i < size!; i++) {
    const item = dataStateRef.list[queueState.len + i];
    if (!item) break;
    const rect = itemSizeInfo.value.get(item.id)!;
    temporaryList.value.push({
      item,
      y: 0,
      h: 0,
      imageHeight: rect.imageHeight,
      style: {
        width: `${rect.width}px`,
      },
    });
  }

  nextTick(() => {
    const list = document.querySelector("#temporary-list")!;
    [...list.children].forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      temporaryList.value[index].h = rect.height;
    });
    isShow.value = true;
    updateItemSize();
    addInQueue(temporaryList.value.length);
    temporaryList.value = [];
  });
};

const initScrollState = () => {
  scrollState.value.viewWidth = containerRef.value!.clientWidth;
  scrollState.value.viewHeight = containerRef.value!.clientHeight;
  scrollState.value.start = containerRef.value!.scrollTop;
};

const init = async () => {
  initScrollState();
  resizeObserver.observe(containerRef.value!);
  const len = await loadDataList();
  setItemSize();
  len && mountTemporaryList(len);
};

onMounted(() => {
  init();
});

onUnmounted(() => {
  if (containerRef.value) {
    resizeObserver.unobserve(containerRef.value!);
  }
});
</script>

<style scoped lang="scss">
.fs-virtual-waterfall {
  &-container {
    width: 100%;
    height: 100%;
    // overflow-y: scroll;
    // overflow-x: hidden;
  }
  &-list {
    position: relative;
    width: 100%;
  }
  &-item {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
  }
}
</style>
