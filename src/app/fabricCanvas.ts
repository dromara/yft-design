import { useMainStore, useTemplatesStore } from '@/store'
import { CanvasElement } from '@/types/canvas'
import { Canvas, Object, CanvasOptions } from 'fabric'
import { shallowRef } from 'vue'

export class FabricCanvas extends Canvas {
  declare readonly _serviceBrand: undefined

  public activeObject = shallowRef<Object>()

  constructor(el: string | HTMLCanvasElement, options?: CanvasOptions) {
    super(el, options)
  }

  public onObjectModified() {
    const templatesStore = useTemplatesStore()
    this.on('object:modified', () => templatesStore.modifedElement())
  }

  // @ts-ignore
  public get _activeObject() {
    return this.activeObject ? this.activeObject.value : undefined
  }

  public set _activeObject(value) {
    const mainStore = useMainStore()
    mainStore.setCanvasObject(value as CanvasElement)
    this.activeObject.value = value
  }
}