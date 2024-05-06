import { defineStore } from 'pinia'
import { Templates } from '@/mocks/templates'
import { Template, CanvasElement, ImageElement, GroupElement, RectElement } from '@/types/canvas'
import { Object as FabricObject, SerializedImageProps, Image, Group } from 'fabric'
import { WorkSpaceDrawType, propertiesToInclude } from '@/configs/canvas'
import { DataState, ScrollState, QueueState, ICardItem, IBookItemRect, IBookRenderItem } from '@/types/templates'
import { useMainStore } from './main'
import { ElementNames } from '@/types/elements'
import useCanvasScale from '@/hooks/useCanvasScale'
import useCanvas from '@/views/Canvas/useCanvas'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useCommon from '@/views/Canvas/useCommon'
import usePixi from '@/views/Canvas/usePixi'
import list from "@/configs/card";


interface UpdateElementData {
  id: string | string[]
  left?: number
  top?: number
  props: Partial<CanvasElement>
}

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

export interface TemplatesState {
  mainRef: HTMLDivElement | null
  templates: Template[]
  templateIndex: number
  dataState: DataState
  scrollState: ScrollState
  queueState: QueueState
  containerRef: HTMLDivElement | null
  temporaryRef: HTMLDivElement | null
  itemSizeInfo: Map<ICardItem["id"], IBookItemRect>
  isShow: boolean
  temporaryList: any[]
}

export const useTemplatesStore = defineStore('Templates', {
  state: (): TemplatesState => ({
    // theme: theme, // 主题样式
    mainRef: null,
    templates: Templates, // 页面页面数据
    templateIndex: 0, // 当前页面索引
    dataState: {
      loading: false,
      isFinish: false,
      currentPage: 1,
      list: []
    },
    scrollState: {
      viewWidth: 0,
      viewHeight: 0,
      start: 0,
    },
    queueState: {
      queue: [],
      len: 0,
    },
    containerRef: null,
    temporaryRef: null,
    itemSizeInfo: new Map(),
    isShow: false,
    temporaryList: []
    // fixedRatio: false, // 固定比例
    // slideUnit: 'mm', // 尺寸单位
    // slideName: '', // 模板名称
    // slideId: '', // 模板id
  }),

  getters: {
    currentTemplate(state) {
      return state.templates[state.templateIndex] as Template
    },

    currentTemplateWidth(state) {
      const currentTemplate = state.templates[state.templateIndex]
      return currentTemplate.width / currentTemplate.zoom
    },

    currentTemplateHeight(state) {
      const currentTemplate = state.templates[state.templateIndex]
      return currentTemplate.height / currentTemplate.zoom
    },

    currentTemplateElement(state) {
      const currentTemplate = state.templates[state.templateIndex]
      const [ canvas ] = useCanvas()
      const activeObject = canvas.getActiveObject() as CanvasElement
      return currentTemplate.objects.filter(ele => ele.id === activeObject.id)[0]
    }
  },

  actions: {
    async renderTemplate() {
      const [ canvas ] = useCanvas()
      const { initCommon } = useCommon()
      const { setCanvasSize } = useCanvasScale()
      await canvas.loadFromJSON(this.currentTemplate)
      this.setObjectFilter(this.currentTemplate.objects as CanvasElement[])
      setCanvasSize()
      initCommon()
    },

    async renderElement() {
      const [ canvas ] = useCanvas()
      const { initCommon } = useCommon()
      const { setCanvasSize } = useCanvasScale()
      const mainStore = useMainStore()
      canvas.discardActiveObject()
      mainStore.setCanvasObject(undefined)
      await canvas.loadFromJSON(this.currentTemplate)
      setCanvasSize()
      initCommon()
    },

    modifedElement() {
      const [ canvas ] = useCanvas()
      const { addHistorySnapshot } = useHistorySnapshot()
      const canvasTemplate = canvas.toObject(propertiesToInclude)
      this.templates[this.templateIndex].objects = canvasTemplate.objects
      this.templates[this.templateIndex].background = canvasTemplate.background
      this.templates[this.templateIndex].backgroundImage = canvasTemplate.backgroundImage
      addHistorySnapshot()
    },

    setClip(clip: number) {
      const { addHistorySnapshot } = useHistorySnapshot()
      this.templates.forEach(template => {
        template.clip = clip
      })
      addHistorySnapshot()
    },

    setSize(width: number, height: number, zoom: number) {
      const { initCommon } = useCommon()
      const { addHistorySnapshot } = useHistorySnapshot()
      this.templates.forEach(template => {
        template.width = width
        template.height = height
        template.zoom = zoom
        template.objects.filter(item => item.id === WorkSpaceDrawType).map(ele => {
          ele.width = width / zoom
          ele.height = height / zoom
        })
      })
      initCommon()
      addHistorySnapshot()
    },

    setObjectFilter(objects: CanvasElement[]) {
      objects.forEach(ele => {
        if (ele.type.toLowerCase() === ElementNames.IMAGE) {
          this.setImageFilter(ele as ImageElement)
          // this.setImageMask(ele as ImageElement)
        }
        if (ele.type.toLowerCase() === ElementNames.GROUP) {
          this.setObjectFilter(((ele as GroupElement).objects) as CanvasElement[])
        }
      })
    },

    setImageFilter(image: ImageElement) {
      if (!image.pixiFilters) return
      const [ pixi ] = usePixi()
      pixi.postMessage({
        id: image.id,
        type: "filter", 
        src: image.src, 
        pixiFilters: JSON.stringify(image.pixiFilters), 
        width: image.width, 
        height: image.height
      });
    },

    setImageMask(image: ImageElement) {
      if (!image.mask) return
      const [ pixi ] = usePixi()
      pixi.postMessage({
        id: image.id,
        type: "mask", 
        src: image.src,
        mask: JSON.stringify(image.mask), 
        width: image.width, 
        height: image.height
      });
    },

    setTemplates(templates: Template[]) {
      this.templates = templates
    },

    setTemplateIndex(index: number) {
      this.templateIndex = index
    },

    async addTemplate(template: Template | Template[]) {
      const templates = Array.isArray(template) ? template : [template]
      const addIndex = this.templateIndex + 1
      this.templates.splice(addIndex, 0, ...templates)
      this.templateIndex = addIndex
      await this.renderTemplate()
    },

    updateTemplate(props: Partial<Template>) {
      const { addHistorySnapshot } = useHistorySnapshot()
      const templateIndex = this.templateIndex
      this.templates[templateIndex] = { ...this.templates[templateIndex], ...props }
      addHistorySnapshot()
    },

    deleteTemplate(templateId: string | string[]) {
      const { addHistorySnapshot } = useHistorySnapshot()
      const templateIds = Array.isArray(templateId) ? templateId : [templateId]
  
      const deleteTemplatesIndex = []
      for (let i = 0; i < templateIds.length; i++) {
        const index = this.templates.findIndex(item => item.id === templateIds[i])
        deleteTemplatesIndex.push(index)
      }
      let newIndex = Math.min(...deleteTemplatesIndex)
  
      const maxIndex = this.templates.length - templateIds.length - 1
      if (newIndex > maxIndex) newIndex = maxIndex
  
      this.templateIndex = newIndex
      this.templates = this.templates.filter(item => !templateIds.includes(item.id))
      addHistorySnapshot()
    },

    updateWorkSpace(props: Partial<Template>) {
      const templateIndex = this.templateIndex
      this.templates[templateIndex] = { ...this.templates[templateIndex], ...props }
    },

    updateElement(data: UpdateElementData) {
      const { addHistorySnapshot } = useHistorySnapshot()
      const { id, props } = data
      const elementIds = typeof id === 'string' ? [id] : id
      if (!elementIds) return
      const template = this.templates[this.templateIndex]
      const elements = template.objects.map(el => elementIds.includes(el.id) ? { ...el, ...props }: el)
      this.templates[this.templateIndex].objects = elements as FabricObject[]
      addHistorySnapshot()
    },

    addElement(element: FabricObject | FabricObject[]) {
      const { addHistorySnapshot } = useHistorySnapshot()
      const elements = Array.isArray(element) ? element : [element]
      const currentTemplateElements = this.templates[this.templateIndex].objects
      const newElements = [...currentTemplateElements, ...elements]
      this.templates[this.templateIndex].objects = newElements as FabricObject[]
      addHistorySnapshot()
    },

    deleteElement(elementId: string | string[]) {
      const { addHistorySnapshot } = useHistorySnapshot()
      const elementIds = Array.isArray(elementId) ? elementId : [elementId]
      const currentTemplateElements = this.templates[this.templateIndex].objects
      const newElements = currentTemplateElements.filter(item => !elementIds.includes(item.id))
      this.templates[this.templateIndex].objects = newElements
      addHistorySnapshot()
    },

    setBackgroundImage(props: SerializedImageProps) {
      this.currentTemplate.backgroundImage = props
    },

    getData(page: number, pageSize: number) {
      return new Promise<ICardItem[]>((resolve) => {
        setTimeout(() => {
          resolve(list.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize));
        }, 1000);
      });
    },

    async getTemplateData() {
      if (this.dataState.isFinish) return;
      this.dataState.loading = true;
      const list = await this.getData(this.dataState.currentPage++, 20);
      if (!list.length) {
        this.dataState.isFinish = true;
        return;
      }
      this.dataState.list.push(...list);
      this.dataState.loading = false;
      return list.length;
    },
    handleScroll() {
      const computedHeight = computed(() => {
        let minIndex = 0,
          minHeight = Infinity,
          maxHeight = -Infinity;
        this.queueState.queue.forEach(({ height }, index) => {
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
      const { scrollTop, clientHeight } = this.containerRef!;
      this.scrollState.start = scrollTop;
      if (!this.dataState.loading && !(this.queueState.len < this.dataState.list.length)) {
        this.getTemplateData().then((len) => {
          len && this.setItemSize(2, 2);
          len && this.mountTemporaryList();
        });
        return;
      }
      if (scrollTop + clientHeight > computedHeight.value.minHeight) {
        this.mountTemporaryList();
      }
    },

    setItemSize (column: number, gap: number) {
      this.itemSizeInfo = this.dataState.list.reduce<Map<ICardItem["id"], IBookItemRect>>((pre, current) => {
        const itemWidth = Math.floor((this.scrollState.viewWidth - (column - 1) * gap) / column);
        const rect = this.itemSizeInfo.get(current.id);
        pre.set(current.id, {
          width: itemWidth,
          height: rect ? rect.height : 0,
          imageHeight: Math.floor((itemWidth * current.height) / current.width),
        });
        return pre;
      }, new Map());
    },

    mountTemporaryList(size = 12) {
      this.queueState.len < this.dataState.list.length
      if (!(this.queueState.len < this.dataState.list.length)) return;
      this.isShow = false;
      for (let i = 0; i < size!; i++) {
        const item = this.dataState.list[this.queueState.len + i];
        if (!item) break;
        const rect = this.itemSizeInfo.get(item.id)!;
        this.temporaryList.push({
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
        if (!list) return
        [...list.children].forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          this.temporaryList[index].h = rect.height;
        });
        this.isShow = true;
        this.updateItemSize();
        this.addInQueue(this.temporaryList.length);
        // this.temporaryList = [];
      });
    },

    updateItemSize() {
      this.temporaryList.forEach(({ item, h }) => {
        const rect = this.itemSizeInfo.get(item.id)!;
        this.itemSizeInfo.set(item.id, { ...rect, height: h });
      });
    },
    addInQueue(size = 12) {
      const computedHeight = computed(() => {
        let minIndex = 0,
          minHeight = Infinity,
          maxHeight = -Infinity;
        this.queueState.queue.forEach(({ height }, index) => {
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
      for (let i = 0; i < size!; i++) {
        const minIndex = computedHeight.value.minIndex;
        const currentColumn = this.queueState.queue[minIndex];
        const before = currentColumn.list[currentColumn.list.length - 1] || null;
        const dataItem = this.dataState.list[this.queueState.len];
        console.log('dataItem:', dataItem)
        const item = this.generatorItem(dataItem, before, minIndex);
        currentColumn.list.push(item);
        currentColumn.height += item.h;
        this.queueState.len++;
      }
    },
    generatorItem (item: ICardItem, before: IBookRenderItem | null, index: number): IBookRenderItem {
      const rect = this.itemSizeInfo.get(item.id)!;
      const width = rect.width;
      const height = rect.height;
      const imageHeight = rect.imageHeight;
      let y = 0;
      if (before) y = before.y + before.h + 15;
      return {
        item,
        y,
        h: height,
        imageHeight,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate3d(${index === 0 ? 0 : (width + 15) * index}px, ${y}px, 0)`,
        },
      };
    },
    // handleScroll(rafThrottle(() => {
    //   const { scrollTop, clientHeight } = containerRef.value!;
    //   scrollState.start = scrollTop;
    //   if (!this.dataState.loading && !hasMoreData.value) {
    //     loadDataList().then((len) => {
    //       len && setItemSize();
    //       len && mountTemporaryList();
    //     });
    //     return;
    //   }
    //   if (scrollTop + clientHeight > computedHeight.value.minHeight) {
    //     mountTemporaryList();
    //   }
    // }),
  }
})