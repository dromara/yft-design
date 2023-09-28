import * as fabric from 'fabric'
import { nanoid } from "nanoid"
import { storeToRefs } from "pinia"
import { KEYS } from '@/configs/hotkey'
import { ElementNames } from "@/types/elements"
import { getPathPoints, paths2str } from '@/utils/parsePath'
import { propertiesToInclude, WorkSpaceName } from "@/configs/canvas"
import { useFabricStore, useMainStore, useTemplatesStore } from "@/store"
import { 
  CanvasOption, 
  GroupOption, 
  ImageOption, 
  TextboxOption, 
  PathOption, 
  RectOption, 
  PolygonOption 
} from "@/types/option"
import { 
  TextboxElement, 
  PolygonElement,
  CanvasElement,
  PathElement,
  RectElement,
  GroupElement
} from "@/types/canvas"
import useCreateElement from './useCreateElement'
import useCanvas from "@/views/Canvas/useCanvas"
import useCanvasZindex from "./useCanvasZindex"

export default () => {
  const templatesStore = useTemplatesStore()
  const mainStore = useMainStore()
  const { currentTemplate } = storeToRefs(templatesStore)
  const { createPathElement } = useCreateElement()
  const { elementCoords, elementHover, isChecked } = storeToRefs(useFabricStore())
  const { canvasObject, clonedObject, currentPoint } = storeToRefs(mainStore)
  const { setZindex } = useCanvasZindex()

  const sortElement = async (newIndex: number, oldIndex: number, option: CanvasOption) => {
    if (oldIndex === newIndex) return
    const element = queryElement(option.id)
    if (!element) return
    if (element.group) {
      const elementGroup = queryOption((element.group as GroupElement).id) as GroupOption
      const _element = elementGroup.objects[oldIndex]
      elementGroup.objects.splice(oldIndex, 1)
      elementGroup.objects.splice(newIndex, 0, _element)
    } 
    else {
      const _elements = JSON.parse(JSON.stringify(currentTemplate.value.objects))
      const _element = _elements[oldIndex]
      _elements.splice(oldIndex, 1)
      _elements.splice(newIndex, 0, _element)
      currentTemplate.value.objects = _elements
    }
    await templatesStore.renderElement()
    templatesStore.modifedElement()
  }

  const lockElement = (eid: string, status: boolean) => {
    const [ canvas ] = useCanvas()
    const element = queryElement(eid)
    if (!element) return
    element.lockMovementX = status
    element.lockMovementY = status
    canvas.renderAll()
    templatesStore.modifedElement()
  }

  const copyElement = async () => {
    if (!canvasObject.value) return
    clonedObject.value = await canvasObject.value.clone(propertiesToInclude)
  }

  const patseEelement = async () => {
    const [ canvas ] = useCanvas()
    if (!clonedObject.value) return
    const clonedObj = await clonedObject.value.clone(propertiesToInclude) as CanvasElement
    let left = clonedObject.value.left + 10, top = clonedObject.value.top + 10
    if (currentPoint.value) {
      left = currentPoint.value.x, top = currentPoint.value.y
    }
    canvas.discardActiveObject()
    mainStore.setCanvasObject(null)
    clonedObj.set({left, top, evented: true})
    if (clonedObj.type === ElementNames.ACTIVE) {
      clonedObj.canvas = canvas
      const groupObject = clonedObj as GroupElement
      groupObject.forEachObject(item => {
        const obj = item as CanvasElement
        obj.id = nanoid(15)
        obj.name = item.type
        canvas.add(obj)
        setZindex(canvas)
        templatesStore.modifedElement()
      })
      clonedObj.setCoords()
    }
    else {
      clonedObj.id = nanoid(15)
      clonedObj.name = clonedObj.type
      canvas.add(clonedObj)
      setZindex(canvas)
      templatesStore.modifedElement()
    }
    clonedObject.value.top = top
    clonedObject.value.left = left
    canvas.setActiveObject(clonedObj)
    canvas.renderAll()
  }

  const deleteTextbox = (element: TextboxElement): boolean => {
    const [ canvas ] = useCanvas()
    if (element.isEditing) {
      const textboxElement = element as TextboxElement
      const selectedText = textboxElement.getSelectedText()
      if (selectedText) {
        textboxElement.removeChars(textboxElement.selectionStart, textboxElement.selectionEnd)
      } 
      else {
        textboxElement.removeChars(textboxElement.selectionStart, textboxElement.selectionStart + 1)
      }
      canvas.renderAll()
      return true
    } 
    return false
  }

  const deleteElement = (eid: string) => {
    const [ canvas ] = useCanvas()
    const element = queryElement(eid)
    if (!element) return
    if (element.group) {
      if ((element.group as GroupElement)._objects.length === 1) {
        const groupElement = element.group as GroupElement
        deleteElement(groupElement.id)
      }
      else {
        if (element.type === ElementNames.TEXTBOX && deleteTextbox(element as TextboxElement)) return
        element.group.remove(element)
      }
    }
    if (element.type === ElementNames.TEXTBOX && deleteTextbox(element as TextboxElement)) return
    canvas.discardActiveObject()
    mainStore.setCanvasObject(null)
    canvas.remove(element)
    canvas.renderAll()
    templatesStore.modifedElement()
  }

  const moveElement = (command: string, step = 2) => {
    const [ canvas ] = useCanvas()
    const activeObject = canvas.getActiveObject() as CanvasElement
    if (!activeObject || !activeObject.left || !activeObject.top) return
    const left = activeObject.left, top = activeObject.top
    switch (command) {
      case KEYS.LEFT: 
        activeObject.set('left', left - step)
        activeObject.setCoords()
        canvas.renderAll()
        break
      case KEYS.RIGHT: 
        activeObject.set('left', left + step)
        activeObject.setCoords()
        canvas.renderAll()
        break
      case KEYS.UP: 
        activeObject.set('top', top - step)
        activeObject.setCoords()
        canvas.renderAll()
        break
      case KEYS.DOWN: 
        activeObject.set('top', top + step)
        activeObject.setCoords()
        canvas.renderAll()
        break
      default: break
    }
    // @ts-ignore
    templatesStore.updateElement({ id: activeObject.id, props: activeObject.toObject(propertiesToInclude as any[]) })
  }

  const cutElement = () => {
    if (!canvasObject.value) return
    copyElement()
    deleteElement(canvasObject.value.id)
  }

  const combineElements = () => {
    const [ canvas ] = useCanvas()
    const activeObjects = canvas.getActiveObjects() as CanvasElement[]
    if (!activeObjects) return
    canvas.discardActiveObject()
    mainStore.setCanvasObject(null)
    const groupElement = new fabric.Group(activeObjects, { 
      // @ts-ignore
      id: nanoid(10),
      name: ElementNames.GROUP, 
      interactive: true, 
      subTargetCheck: true,
    })
    canvas.add(groupElement)
    templatesStore.deleteElement(activeObjects.map(item => item.id))
    templatesStore.addElement(groupElement.toObject(propertiesToInclude as any[]) as GroupOption)
    templatesStore.renderElement()
    canvas.remove(...activeObjects)
    setZindex(canvas)
    canvas.renderAll()
  }

  const intersectElements = () => {
    const [ canvas ] = useCanvas()
    const activeObjects = canvas.getActiveObjects() as PathElement[]
    if (!activeObjects) return
    canvas.discardActiveObject()
    mainStore.setCanvasObject(null)
    if (activeObjects.length !== 2) return
    canvas.discardActiveObject()
    mainStore.setCanvasObject(null)
    activeObjects[1].set({globalCompositeOperation: 'xor'})
    const groupElement = new fabric.Group(activeObjects, { 
      // @ts-ignore
      id: nanoid(10),
      name: ElementNames.GROUP,
    })
    canvas.add(groupElement)
    templatesStore.deleteElement(activeObjects.map(item => item.id))
    templatesStore.addElement(groupElement.toObject(propertiesToInclude as any[]) as GroupOption)
    templatesStore.renderElement()
    canvas.remove(...activeObjects)
    setZindex(canvas)
    canvas.renderAll()
  }

  const uncombineElements = () => {
    const [ canvas ] = useCanvas()
    const activeObject = canvas.getActiveObject() as GroupElement
    if (!activeObject) return
    const objects = activeObject.removeAll() as fabric.Object[]
    canvas.discardActiveObject()
    mainStore.setCanvasObject(null)
    if (activeObject.group) {
      activeObject.group.add(...objects)
      activeObject.group.remove(activeObject)
    }
    else {
      canvas.add(...objects)
      canvas.remove(activeObject)
    }
    templatesStore.modifedElement()
    setZindex(canvas)
    canvas.renderAll()
  }

  const findElement = (eid: string, elements: CanvasElement[]): CanvasElement | undefined => {
    for (let i = 0; i < elements.length; i++) {
      const item = elements[i] as CanvasElement
      if (item.id === eid) {
        return item
      }
      if (item.type === ElementNames.GROUP) {
        const element = findElement(eid, (item as GroupElement)._objects)
        if (element) return element
      }
    }
    return
  }

  const queryElement = (eid: string): CanvasElement | undefined => {
    const [ canvas ] = useCanvas()
    const elements = canvas.getObjects().filter(item => (item as CanvasElement).name !== WorkSpaceName)
    let element = undefined
    element = elements.filter(obj => (obj as CanvasElement).id === eid)[0] as CanvasElement
    if (element) {
      return element
    }
    element = findElement(eid, elements as CanvasElement[])
    return element
  }

  const findOption = (eid: string, options: CanvasOption[]): CanvasOption | undefined => {
    for (let i = 0; i < options.length; i++) {
      const item = options[i] as CanvasOption
      if (item.id === eid) {
        return item
      }
      if (item.type === ElementNames.GROUP) {
        const option = findOption(eid, (item as GroupOption).objects)
        if (option) return option
      }
    }
    return
  }

  const queryOption = (eid: string): CanvasOption | undefined => {
    const options = currentTemplate.value.objects
    let option = undefined
    option = options.filter(obj => obj.id === eid)[0] as CanvasOption
    if (option) return option
    return findOption(eid, options)
  }

  const selectElement = (eid: string) => {
    const [ canvas ] = useCanvas()
    const element = queryElement(eid)
    elementCoords.value.length = 0
    elementHover.value = ''
    if (!element) return
    canvasObject.value = element
    canvas.setActiveObject(element as CanvasElement)
  }

  const visibleElement = (eid: string, status: boolean) => {
    const [ canvas ] = useCanvas()
    const element = queryElement(eid)
    if (!element) return
    element.visible = status
    templatesStore.modifedElement()
    canvas.discardActiveObject()
    mainStore.setCanvasObject(null)
    canvas.renderAll()
  }

  const showElement = (item: GroupElement) => {
    const element = queryElement(item.id) as GroupElement
    if (!element) return 
    element.isShow = !element.isShow
    templatesStore.modifedElement()
  }

  const mouseoverElement = (eid: string) => {
    const activeObject = canvasObject.value as CanvasElement
    if (activeObject && activeObject.id === eid) return
    const element = queryElement(eid)
    if (!element) return
    elementCoords.value = element.getCoords()
    elementHover.value = element.id
    if (element.group) {
      if (!element.group.subTargetCheck || !element.group.interactive) {
        elementCoords.value.length = 0
        return
      }
      elementCoords.value = [element.oCoords.bl, element.oCoords.br, element.oCoords.tr, element.oCoords.tl]
    }
  }

  const mouseleaveElement = () => {
    elementCoords.value.length = 0
  }

  const cancelElement = () => {
    const [ canvas ] = useCanvas()
    mainStore.setCanvasObject(null)
    canvas.discardActiveObject()
    canvas.renderAll()
  }

  const frontElement = () => {
    const [ canvas ] = useCanvas()
    if (!canvasObject.value) return
    canvas.bringObjectToFront(canvasObject.value as CanvasElement)

    setZindex(canvas)
    canvas.renderAll()
    templatesStore.modifedElement()
  }

  const backElement = () => {
    const [ canvas ] = useCanvas()
    if (!canvasObject.value) return
    canvas.sendObjectToBack(canvasObject.value as CanvasElement)
    setZindex(canvas)
    canvas.renderAll()
    templatesStore.modifedElement()
  }

  const forwardElement = () => {
    const [ canvas ] = useCanvas()
    if (!canvasObject.value) return
    // canvas.bringObjectForward(canvasObject.value)
    setZindex(canvas)
    canvas.renderAll()
    templatesStore.modifedElement()
  }

  const backwardElement = () => {
    const [ canvas ] = useCanvas()
    if (!canvasObject.value) return
    setZindex(canvas)
    canvas.renderAll()
    templatesStore.modifedElement()
  }

  const queryTextboxChecked = (elements: CanvasElement[]): boolean => {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      if (element.type === ElementNames.TEXTBOX && (element as TextboxElement).isCheck) {
        return true
      }
      if (element.type === ElementNames.GROUP) {
        const group = element as GroupElement
        const isChecked = queryTextboxChecked(group._objects)
        if (isChecked) return true
      }
    }
    return false
  }

  const checkElement = (eid: string, status: boolean) => {
    const [ canvas ] = useCanvas()
    const element = queryElement(eid) as TextboxElement
    element.isCheck = status
    canvas.renderAll()
    templatesStore.modifedElement()
    const elements = canvas.getObjects().filter(obj => (obj as CanvasElement).name !== WorkSpaceName) as CanvasElement[]
    isChecked.value = queryTextboxChecked(elements)
  }

  return {
    // createElement,
    sortElement,
    lockElement,
    copyElement,
    cutElement,
    patseEelement,
    deleteElement,
    moveElement,
    combineElements,
    uncombineElements,
    queryElement,
    selectElement,
    visibleElement,
    showElement,
    mouseoverElement,
    mouseleaveElement,
    cancelElement,
    frontElement,
    backElement,
    forwardElement,
    backwardElement,
    checkElement,
    intersectElements
  }
}