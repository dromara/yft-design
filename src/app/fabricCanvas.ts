import { useMainStore, useTemplatesStore } from '@/store'
import { CanvasElement } from '@/types/canvas'
import { Canvas, Object, CanvasOptions } from 'fabric'
import { shallowRef } from 'vue'
import { toRef } from './attribute/toRef'
import { check } from '@/utils/check'
import { nonid } from '@/utils/common'

export class FabricCanvas extends Canvas {
  declare readonly _serviceBrand: undefined

  public activeObject = shallowRef<Object>()

  constructor(el: string | HTMLCanvasElement, options?: CanvasOptions) {
    super(el, options)
    this.onObjectModified()
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

  override add(...objects: Object[]): number {
    return super.add(
      ...objects.map((obj) => {
        this.setDefaultAttr(obj)
        return toRef(obj)
      }),
    )
  }

  override insertAt(index: number, ...objects: Object[]): number {
    return super.insertAt(
      index,
      ...objects.map((obj) => {
        this.setDefaultAttr(obj)
        return toRef(obj)
      }),
    )
  }

  private setDefaultAttr(target: Object) {
    // 添加名称
    if (!target.name) {
      target.set({name: target.type})
    }
    // 添加id
    if (!target.id) {
      target.set({id: nonid(8)})
    }
    if (check.isCollection(target)) {
      target._objects.forEach((obj) => {
        this.setDefaultAttr(obj)
      })
    }
  }
}