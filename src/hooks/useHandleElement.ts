import { Object as FabricObject, Group, Path } from 'fabric'
import { nanoid } from "nanoid"
import { storeToRefs } from "pinia"
import { KEYS } from '@/configs/hotkey'
import { ElementNames } from "@/types/elements"
import { propertiesToInclude, WorkSpaceCommonType } from "@/configs/canvas"
import { useFabricStore, useMainStore, useTemplatesStore } from "@/store"
import { TextboxElement, CanvasElement, GroupElement } from "@/types/canvas"
import { clipperPath } from '@/utils/clipper'
import { useActiveElement } from '@vueuse/core'
import { computed } from 'vue'
import useCanvas from "@/views/Canvas/useCanvas"
import useCanvasZindex from "./useCanvasZindex"

export default () => {
  const templatesStore = useTemplatesStore()
  const mainStore = useMainStore()
  const { currentTemplate } = storeToRefs(templatesStore)
  const { isChecked } = storeToRefs(useFabricStore())
  const { canvasObject, clonedObject, currentPoint } = storeToRefs(mainStore)
  const { setZindex } = useCanvasZindex()

  const sortElement = async (eventData: { moved: { newIndex: number, oldIndex: number, element: FabricObject} }) => {
    // if (WorkSpaceCommonType.includes(eventData.moved.element.id)) return
    // const newIndex = eventData.moved.newIndex, oldIndex = eventData.moved.oldIndex, option = eventData.moved.element
    // if (oldIndex === newIndex) return
    // const element = queryElement(option.id)
    // if (!element) return
    // if (element.group) {
    //   const elementGroup = queryOption((element.group as GroupElement).id) as Group
    //   if (!elementGroup) return
    //   const _element = elementGroup.objects[oldIndex]
    //   elementGroup.objects.splice(oldIndex, 1)
    //   elementGroup.objects.splice(newIndex, 0, _element)
    // } 
    // else {
    //   const _elements = JSON.parse(JSON.stringify(currentTemplate.value.objects))
    //   const _element = _elements[oldIndex]
    //   _elements.splice(oldIndex, 1)
    //   _elements.splice(newIndex, 0, _element)
    //   currentTemplate.value.objects = _elements
    // }
    // await templatesStore.renderElement()
    // templatesStore.modifedElement()
  }

  const layerElement = (e: any, originalEvent: any) => {
    console.log('e:', e)
    console.log('originalEvent:', originalEvent)
    if (WorkSpaceCommonType.includes(e.draggedContext.element.id)) return false;
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
    const clonedObj = await clonedObject.value.clone(propertiesToInclude) as FabricObject
    let left = clonedObject.value.left + 10, top = clonedObject.value.top + 10
    if (currentPoint.value) {
      left = currentPoint.value.x, top = currentPoint.value.y
    }
    canvas.discardActiveObject()
    mainStore.setCanvasObject(undefined)
    clonedObj.set({left, top, evented: true})
    if (clonedObj.type === ElementNames.ACTIVE) {
      clonedObj.canvas = canvas
      const groupObject = clonedObj as GroupElement
      groupObject.forEachObject(item => {
        const obj = item as CanvasElement
        canvas.add(obj as FabricObject)
        setZindex(canvas)
        templatesStore.modifedElement()
      })
      clonedObj.setCoords()
    }
    else {
      canvas.add(clonedObj as FabricObject)
      setZindex(canvas)
      templatesStore.modifedElement()
    }
    clonedObject.value.top = top
    clonedObject.value.left = left
    canvas.setActiveObject(clonedObj as FabricObject)
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
        element.group.remove(element as FabricObject)
      }
    }
    if (element.type === ElementNames.TEXTBOX && deleteTextbox(element as TextboxElement)) return
    canvas.discardActiveObject()
    mainStore.setCanvasObject(undefined)
    canvas.remove(element as FabricObject)
    canvas.renderAll()
    templatesStore.modifedElement()
  }

  const moveElement = (command: string, step = 2) => {
    const [ canvas ] = useCanvas()
    const activeObject = canvas.getActiveObject() as FabricObject
    if (!activeObject || !activeObject.left || !activeObject.top) return
    const activeElement = useActiveElement()
    if (activeElement.value) {
      const tagName = activeElement.value.tagName
      if (tagName === 'INPUT' || tagName === 'TEXTARE') return
    }
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
    templatesStore.updateElement({ id: activeObject.id, props: activeObject.toObject(propertiesToInclude as any[]) })
  }

  const cutElement = () => {
    if (!canvasObject.value) return
    copyElement()
    deleteElement(canvasObject.value.id)
  }

  const combineElements = async () => {
    const [ canvas ] = useCanvas()
    const activeObjects = canvas.getActiveObjects()
    if (!activeObjects) return
    canvas.discardActiveObject()
    const group = new Group(activeObjects, { 
      // @ts-ignore
      id: nanoid(10),
      name: ElementNames.GROUP, 
      interactive: false, 
      subTargetCheck: true,
    })
    canvas.remove(...activeObjects)
    canvas.add(group)
    templatesStore.modifedElement()
    templatesStore.renderElement()
  }

  const intersectElements = (val: number) => {
    const [ canvas ] = useCanvas()
    let activeObjects = canvas.getActiveObjects()
    if (!activeObjects) return
    if (activeObjects.length === 1 && activeObjects[0].type === ElementNames.GROUP) {
      activeObjects = (activeObjects[0] as Group)._objects
    }
    const res = clipperPath(activeObjects, val)
    const path = new Path(res)
    canvas.add(path)
    canvas.renderAll()
  }

  const uncombineElements = () => {
    const [ canvas ] = useCanvas()
    const activeObject = canvas.getActiveObject() as GroupElement
    if (!activeObject) return
    const objects = activeObject.removeAll() as FabricObject[]
    canvas.discardActiveObject()
    mainStore.setCanvasObject(undefined)
    if (activeObject.group) {
      activeObject.group.add(...objects)
      activeObject.group.remove(activeObject as FabricObject)
    }
    else {
      canvas.add(...objects)
      canvas.remove(activeObject as FabricObject)
    }
    templatesStore.modifedElement()
    setZindex(canvas)
    canvas.renderAll()
  }

  const findElement = (eid: string, elements: FabricObject[] | undefined): FabricObject | undefined => {
    if (!elements) return
    for (let i = 0; i < elements.length; i++) {
      const item = elements[i] as FabricObject
      if (item.id === eid) {
        return item
      }
      if (item.type === ElementNames.GROUP) {
        return findElement(eid, (item as GroupElement).objects)
      }
    }
    return
  }

  const queryElement = (eid: string): FabricObject | undefined => {
    const [ canvas ] = useCanvas()
    const elements = canvas.getObjects().filter(item => !WorkSpaceCommonType.includes((item as FabricObject).id))
    let element = elements.filter(obj => (obj as FabricObject).id === eid)[0] as FabricObject
    if (!element) {
      return findElement(eid, elements as FabricObject[])
    }
    return element
  }

  const findOption = (eid: string, options: FabricObject[]): FabricObject | undefined => {
    for (let i = 0; i < options.length; i++) {
      const item = options[i] as FabricObject | Group
      if (item.id === eid) return item
      if (item.isType('Group')) {
        const option = findOption(eid, (item as Group)._objects)
        if (option) return option
      }
    }
    return
  }

  const queryOption = (eid: string): FabricObject | undefined => {
    const options = currentTemplate.value.objects
    let option = options.filter(obj => obj.id === eid)[0] as FabricObject
    if (option) return option
    return findOption(eid, options)
  }

  const selectElement = (eid: string) => {
    const [ canvas ] = useCanvas()
    const element = queryElement(eid)
    if (!element) return
    canvas.setActiveObject(element as FabricObject)
    canvas.renderAll()
  }

  const visibleElement = (eid: string, visible: boolean) => {
    const [ canvas ] = useCanvas()
    const element = queryElement(eid)
    if (!element) return
    element.set({visible})
    
    canvas.discardActiveObject()
    canvas.renderAll()
    templatesStore.modifedElement()
  }

  const showElement = (eid: string) => {
    const element = queryElement(eid) as GroupElement
    if (!element) return 
    element.isShow = !element.isShow
    templatesStore.modifedElement()
  }

  const mouseoverElement = (eid: string) => {
    const activeObject = canvasObject.value as CanvasElement
    if (activeObject && activeObject.id === eid) return
    const element = queryElement(eid)
    if (!element) return
    mainStore.setHoveredObject(element as FabricObject)
  }

  const mouseleaveElement = (eid: string) => {
    mainStore.setHoveredObject(undefined)
    const activeObject = canvasObject.value as CanvasElement
    if (activeObject && activeObject.id === eid) return
    const element = queryElement(eid)
    if (!element) return
    mainStore.setLeaveddObject(element as FabricObject)
  }

  const cancelElement = () => {
    const [ canvas ] = useCanvas()
    mainStore.setCanvasObject(undefined)
    canvas.discardActiveObject()
    canvas.renderAll()
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

  const queryTextboxChecked = (elements: FabricObject[]): boolean => {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      if (element.type === ElementNames.TEXTBOX && (element as TextboxElement).isCheck) {
        return true
      }
      if (element.type === ElementNames.GROUP) {
        const group = element as GroupElement
        const isChecked = queryTextboxChecked(group.objects)
        if (isChecked) return true
      }
    }
    return false
  }

  const checkElement = (eid: string) => {
    const [ canvas ] = useCanvas()
    const element = queryElement(eid) as TextboxElement
    element.isCheck = !element.isCheck
    canvas.renderAll()
    templatesStore.modifedElement()
    const elements = canvas.getObjects().filter(item => !WorkSpaceCommonType.includes((item as CanvasElement).id)) as FabricObject[]
    isChecked.value = queryTextboxChecked(elements)
  }

  return {
    // createElement,
    layerElement,
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
    forwardElement,
    backwardElement,
    checkElement,
    intersectElements
  }
}