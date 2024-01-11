import { useMainStore, useTemplatesStore } from '@/store'
import { Canvas, Object as FabricObject } from 'fabric'
import { shallowRef } from 'vue'
import { toRef } from './attribute/toRef'
import { check } from '@/utils/check'
import { nonid } from '@/utils/common'

export class FabricCanvas extends Canvas {

  public activeObject = shallowRef<FabricObject>()

  constructor(el: string | HTMLCanvasElement, options?: any) {
    super(el, options)
    const templatesStore = useTemplatesStore()
    this.on('object:modified', () => templatesStore.modifedElement())
  }

  // @ts-ignore
  public get _activeObject() {
    return this.activeObject ? this.activeObject.value : undefined
  }

  public set _activeObject(value) {
    const mainStore = useMainStore()
    mainStore.setCanvasObject(value as FabricObject)
    this.activeObject.value = value
  }

  override add(...objects: FabricObject[]): number {
    return super.add(
      ...objects.map((obj) => {
        this.setDefaultAttr(obj)
        return toRef(obj)
      }),
    )
  }

  override insertAt(index: number, ...objects: FabricObject[]): number {
    return super.insertAt(
      index,
      ...objects.map((obj) => {
        this.setDefaultAttr(obj)
        return toRef(obj)
      }),
    )
  }

  private setDefaultAttr(target: FabricObject) {
    // 添加name
    if (!target.name) {
      target.set({name: target.type})
    }
    // 添加id
    if (!target.id) {
      target.set({id: nonid(8)})
    }
    if (check.isTextObject(target)) {
      target.set({color: target.fill})
    }
    if (check.isCollection(target)) {
      target._objects.forEach((obj) => {
        this.setDefaultAttr(obj)
      })
    }
  }
}