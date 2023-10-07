import { defineStore } from "pinia"
import {  Point } from "fabric/fabric-impl"
import { verticalLine, horizontalLine } from "@/types/elements"


export interface IFabricState {
  wrapperRef: null | HTMLDivElement
  canvasRef: null | HTMLCanvasElement
  zoom: number
  clip: number       // 出血尺寸
  safe: number       // 安全尺寸
  round: number      // 圆角尺寸
  diagonal: number   // 角线
  opacity: number    // 蒙版透明度 0-1
  showClip: boolean  // 显示裁切线
  showSafe: boolean  // 显示安全线
  isDragging: boolean
  isDrawing: boolean
  isCropping: boolean
  isTexting: boolean
  isCtrlKey: boolean
  isModifed: boolean
  isChecked: boolean
  verticalLines: verticalLine[]
  horizontalLines: horizontalLine[]
  elementCoords: Point[]
  elementHover: string
  scalePercentage: number

}

export const useFabricStore = defineStore({
  id: "fabricStore",
  state: (): IFabricState => {
    return {
      wrapperRef: null,
      canvasRef: null,
      zoom: 1,
      clip: 2,
      safe: 5,
      round: 0,
      diagonal: 18,
      opacity: 1,
      showClip: false,
      showSafe: false,
      isDragging: false,
      isDrawing: false,
      isTexting: false,
      isCropping: false,
      isCtrlKey: false,
      isModifed: false,
      isChecked: false,
      verticalLines: [],
      horizontalLines: [],
      elementCoords: [],
      elementHover: '',
      scalePercentage: 80,
    }
  },
  getters: {

  },
  actions: {
    getWidth() {
      return this.wrapperRef?.offsetWidth || (window.innerWidth - 420)
    },
    getHeight() {
      return this.wrapperRef?.offsetHeight || (window.innerHeight - 40)
    },
    // setMouseFrom(data: { x?: number; y?: number; pressure?: number }) {
    //   Object.assign(this.mouseFrom, data)
    // },
    // setMouseTo(data: { x?: number; y?: number; pressure?: number }) {
    //   Object.assign(this.mouseTo, data)
    // },
    setCanvasPercentage(val: number) {
      this.scalePercentage = val
    },
    // setFreeDrawPoints(data: { x?: number; y?: number; pressure?: number }) {
    //   Object.assign(this.freeDrawPoints || {}, data)
    // },
    // 是否拖拽
    setIsDraggingState(flag: boolean) {
      this.isDragging = flag
    },
  },
})
