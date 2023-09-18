import { defineStore, storeToRefs } from 'pinia'
import { Templates } from '@/mocks/templates'
import { Template, CanvasElement } from '@/types/canvas'
import { toObjectFilter, WorkSpaceName } from '@/configs/canvas'
import useCanvasScale from '@/hooks/useCanvasScale'
import useCanvas from '@/views/Canvas/useCanvas'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import useCenter from '@/views/Canvas/useCenter'
import { CanvasOption } from '@/types/option'
import { useMainStore } from './main'
import { useFabricStore } from './fabric'
import { useElementBounding } from '@vueuse/core'

interface UpdateElementData {
  id: string | string[]
  left?: number
  top?: number
  props: Partial<CanvasElement>
}


export interface TemplatesState {
  templates: Template[]
  templateIndex: number
}

export const useTemplatesStore = defineStore('Templates', {
  state: (): TemplatesState => ({
    // theme: theme, // 主题样式
    templates: Templates, // 页面页面数据
    templateIndex: 0, // 当前页面索引
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
      const fabricStore = useFabricStore()
      const { wrapperRef } = storeToRefs(fabricStore)
      // const { createElement } = useHandleElement()
      // canvas.clear()
      // initWorks()
      // initBackground()
      // this.templates[this.templateIndex].objects.forEach(async (element) => {
      //   await createElement(element as CanvasOption)
      // })
      await canvas.loadFromJSON(this.currentTemplate)
      canvas.renderAll()
      const { width, height } = useElementBounding(wrapperRef.value)
      canvas.setDimensions({width: width.value, height: height.value})
      
    },

    async renderElement() {
      const mainStore = useMainStore()
      const { setCanvasSize } = useCanvasScale()
      const [ canvas ] = useCanvas()
      
      // const { createElement } = useHandleElement()
      canvas.discardActiveObject()
      mainStore.setCanvasObject(null)
      await canvas.loadFromJSON(this.currentTemplate)
      setCanvasSize()
      // canvas.remove(...canvas.getObjects().filter(item => (item as CanvasElement).name !== WorkSpaceName))
      // for (let i = 0; i < this.templates[this.templateIndex].objects.length; i++) {
      //   const element = this.templates[this.templateIndex].objects[i] as CanvasOption
      //   await createElement(element as CanvasOption)
      // }
      // this.templates[this.templateIndex].objects.forEach(element => {
      //   
      // })
      // canvas.renderAll()
    },

    modifedElement() {
      const [ canvas ] = useCanvas()
      // const { centerPoint } = useCenter()
      const { addHistorySnapshot } = useHistorySnapshot()
      const canvasTemplate = canvas.toObject(toObjectFilter)
      // for (let i = 0; i < canvasTemplate.objects.length; i++) {
      //   const element = canvasTemplate.objects[i] as CanvasElement
      //   element.left -= centerPoint.x
      //   element.top -= centerPoint.y
      // }
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
      const { addHistorySnapshot } = useHistorySnapshot()
      this.templates.forEach(template => {
        template.width = width
        template.height = height
        template.zoom = zoom
      })
      addHistorySnapshot()
    },

    setTemplates(templates: Template[]) {
      this.templates = templates
    },

    setTemplateIndex(index: number) {
      this.templateIndex = index
    },

    addTemplate(template: Template | Template[]) {
      const { addHistorySnapshot } = useHistorySnapshot()
      const templates = Array.isArray(template) ? template : [template]
      const addIndex = this.templateIndex + 1
      this.templates.splice(addIndex, 0, ...templates)
      this.templateIndex = addIndex
      addHistorySnapshot()
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

    updateElement(data: UpdateElementData) {
      const { addHistorySnapshot } = useHistorySnapshot()
      const { id, props, left, top } = data
      const { centerPoint } = useCenter()
      if (typeof props.left === 'number' && typeof props.top === 'number') {
        props.left -= (left ? left : centerPoint.x)
        props.top -= (top ? top : centerPoint.y)
      }
      if (props.clipPath && typeof props.clipPath.left === 'number' && typeof props.clipPath.top === 'number') {
        props.clipPath.left -= (left ? left : centerPoint.x)
        props.clipPath.top -= (top ? top : centerPoint.y)
      }
      const elementIds = typeof id === 'string' ? [id] : id
      if (!elementIds) return
      const template = this.templates[this.templateIndex]
      const elements = template.objects.map(el => {
        return elementIds.includes(el.id) ? { ...el, ...props }: el
      })
      this.templates[this.templateIndex].objects = (elements as CanvasOption[])
      addHistorySnapshot()
    },

    addElement(element: CanvasOption | CanvasOption[]) {
      const { addHistorySnapshot } = useHistorySnapshot()
      const { centerPoint } = useCenter()
      const elements = Array.isArray(element) ? element : [element]
      elements.forEach(ele => {
        if (typeof ele.left === 'number' && typeof ele.top === 'number') {
          ele.left -= centerPoint.x
          ele.top -= centerPoint.y
        }
      })
      const currentTemplateElements = this.templates[this.templateIndex].objects
      const newElements = [...currentTemplateElements, ...elements]
      this.templates[this.templateIndex].objects = newElements as CanvasOption[]
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
  }
})