import { Object as FabricObject } from 'fabric'
import { customAlphabet } from 'nanoid'
import { defineStore } from 'pinia'
import { SYS_FONTS } from '@/configs/fonts'
import { ImageCategoryInfo } from '@/configs/images'
import { getSupportFonts } from '@/utils/fonts'
import { CanvasElement } from '@/types/canvas'
import { RightStates, PointElement, ImageCategoryData } from '@/types/elements'
import { ExportTypes, PoolType, SystemFont } from '@/types/common'
import useCanvas from '@/views/Canvas/useCanvas'

export interface MainState {
  canvasObject: FabricObject | undefined
  hoveredObject: FabricObject | undefined 
  leavedObject: FabricObject | undefined 
  clonedObject: FabricObject | undefined
  currentPoint: PointElement | null
  rightState: RightStates
  imageCategoryType: string[]
  imageCategoryData: ImageCategoryData[]
  illustrationCategoryType: string[]
  illustrationCategoryData: ImageCategoryData[]
  handleElementId: string
  sizeMode: number
  unitMode: number
  gridColorSelf: [string[]]
  databaseId: string
  selectedTemplatesIndex: number[]
  thumbnailsFocus: boolean
  drawAreaFocus: boolean
  systemFonts: SystemFont[]
  disableHotkeys: boolean
  exportType: ExportTypes
  lastHelp: PoolType
  lastEdit: PoolType
  poolType: PoolType
  poolShow: boolean
  rulerShow: boolean
}

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
export const databaseId = nanoid(10)

export const useMainStore = defineStore('main', {
  state: (): MainState => ({
    canvasObject: undefined,
    clonedObject: undefined,
    hoveredObject: undefined,
    leavedObject: undefined,
    currentPoint: null,
    rightState: RightStates.ELEMENT_WORKER,
    imageCategoryType: [],
    imageCategoryData: ImageCategoryInfo,
    illustrationCategoryType: [],
    illustrationCategoryData: ImageCategoryInfo,
    handleElementId: '', // 正在操作的元素ID
    sizeMode: 0,  // 模板样式
    unitMode: 0,  // 单位
    gridColorSelf: [[]], // 自定义颜色
    databaseId, // 标识当前应用的indexedDB数据库ID
    selectedTemplatesIndex: [],
    thumbnailsFocus: false, // 左侧导航缩略图区域聚焦
    drawAreaFocus: false, // 编辑区聚焦
    systemFonts: SYS_FONTS, // 系统字体
    disableHotkeys: false, // 禁用快捷键
    exportType: 'image', // 导出面板
    lastEdit: 'editor', // 左边栏
    lastHelp: 'editor', // 左边栏
    poolType: 'editor', // 左边栏
    poolShow: false, // 显示左边栏
    rulerShow: true,
  }),

  getters: {
    activeElementList() {
    //   const slidesStore = useSlidesStore()
    //   const currentSlide = slidesStore.currentSlide
    //   if (!currentSlide || !currentSlide.elements) return []
    },
  
    handleElement() {
    //   const slidesStore = useSlidesStore()
    //   const currentSlide = slidesStore.currentSlide
    //   if (!currentSlide || !currentSlide.elements) return null
    //   return currentSlide.elements.find(element => state.handleElementId === element.id) || null
    },
  },

  actions: {
    
    setCanvasObject(canvasObject: FabricObject | undefined) {
      this.canvasObject = canvasObject
    },

    setHoveredObject(hoveredObject: FabricObject | undefined) {
      this.hoveredObject = hoveredObject
    },

    setLeaveddObject(leavedObject: FabricObject | undefined) {
      this.leavedObject = leavedObject
    },

    setActiveObject() {
      const [ canvas ] = useCanvas()
      if (!canvas) return
      const activeObject = canvas._activeObject as CanvasElement | null
    },
    // setHandleElementId(handleElementId: string) {
    //   this.handleElementId = handleElementId
    // },
    
    // setActiveGroupElementId(activeGroupElementId: string) {
    //   this.activeGroupElementId = activeGroupElementId
    // },
    
    // setHiddenElementIdList(hiddenElementIdList: string[]) {
    //   this.hiddenElementIdList = hiddenElementIdList
    // },
  
    // setCanvasDragged(isDragged: boolean) {
    //   this.canvasDragged = isDragged
    // },
    setPoolType(poolType: PoolType) {
      if (poolType === 'help') this.lastHelp = this.poolType
      if (poolType === 'editor') this.lastEdit = this.poolType
      this.poolType = poolType
    },

    setRightState(rightState: RightStates) {
      this.rightState = rightState
    },
  
    setThumbnailsFocus(isFocus: boolean) {
      this.thumbnailsFocus = isFocus
    },

    setSystemFonts() {
      this.systemFonts = getSupportFonts(SYS_FONTS)
    },
    
    setExportType(type: ExportTypes) {
      this.exportType = type
    },

    setDrawAreaFocus(status: boolean) {
      this.drawAreaFocus = status
    },
  
    // setDisableHotkeysState(disable: boolean) {
    //   this.disableHotkeys = disable
    // },
  
    // setGridLineSize(size: number) {
    //   this.gridLineSize = size
    // },
  
    // setRulerState(show: boolean) {
    //   this.showRuler = show
    // },

    // setClipingImageElementId(elId: string) {
    //   this.clipingImageElementId = elId
    // },
  
    // setSelectedTableCells(cells: string[]) {
    //   this.selectedTableCells = cells
    // },
  
    // setScalingState(isScaling: boolean) {
    //   this.isScaling = isScaling
    // },
    
    updateSelectedTemplatesIndex(selectedTemplatesIndex: number[]) {
      this.selectedTemplatesIndex = selectedTemplatesIndex
    },

    // setDialogForColor(show: boolean) {
    //   this.dialogForColor = show
    // },

    // saveDialogForColor(colors: string[]) {
    //   this.dialogForColor = false
    //   this.colorSelfStore.push(colors)
    // },

    // setDialogForTemplate(show: boolean) {
    //   this.dialogForTemplate = show
    // },

    // setSelectPanelState(show: boolean) {
    //   this.showSelectPanel = show
    // },
  },
})