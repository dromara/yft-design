import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useTemplatesStore, useKeyboardStore } from '@/store'
// import { ElementOrderCommands } from '@/types/edit'
import { KEYS } from '@/configs/hotkey'
import useHandleTemplate from './useHandleTemplate'
import useHandleElement from './useHandleElement'
import useHistorySnapshot from './useHistorySnapshot'
import { CanvasElement, GroupElement } from '@/types/canvas'
import { ElementNames } from '@/types/elements'

// import useSlideHandler from './useSlideHandler'
// import useCombineElement from './useCombineElement'
// import useCopyAndPasteElement from './useCopyAndPasteElement'
// import useSelectAllElement from './useSelectAllElement'
// import useMoveElement from './useMoveElement'
// import useOrderElement from './useOrderElement'
// import useHistorySnapshot from './useHistorySnapshot'
// import useScreening from './useScreening'
// import useScaleCanvas from './useScaleCanvas'

export default () => {
  const mainStore = useMainStore()
  const keyboardStore = useKeyboardStore()
  const {
    activeElementIdList,
    disableHotkeys,
    handleElement,
    canvasObject,
    handleElementId,
    thumbnailsFocus,
    drawAreaFocus,
  } = storeToRefs(mainStore)
  const { currentTemplate } = storeToRefs(useTemplatesStore())
  const { ctrlKeyState, shiftKeyState, spaceKeyState } = storeToRefs(keyboardStore)

  const {
    copyTemplate,
    cutTemplate,
    deleteTemplate,
    updateTemplateIndex
  } = useHandleTemplate()
 
  const { 
    copyElement, 
    cutElement,
    patseEelement,
    deleteElement,
    moveElement,
    lockElement,
    combineElements,
    uncombineElements
  } = useHandleElement()
  // const { selectAllElement } = useSelectAllElement()
  // const { moveElement } = useMoveElement()
  // const { orderElement } = useOrderElement()

  const { redo, undo } = useHistorySnapshot()
  // const { enterScreening, enterScreeningFromStart } = useScreening()
  // const { scaleCanvas, resetCanvas } = useScaleCanvas()

  const copy = () => {
    if (canvasObject.value) copyElement()
    else if (thumbnailsFocus.value) copyTemplate()
  }

  const cut = () => {
    if (canvasObject.value) cutElement()
    else if (thumbnailsFocus.value) cutTemplate()
  }

  const patse = () => {
    if (canvasObject.value) patseEelement()
    else if (thumbnailsFocus.value) copyTemplate()
  }

  // const quickCopy = () => {
  //   if (activeElementIdList.value.length) quickCopyElement()
  //   else if (thumbnailsFocus.value) copyAndPasteSlide()
  // }

  // const selectAll = () => {
  //   if (editorAreaFocus.value) selectAllElement()
  //   if (thumbnailsFocus.value) selectAllSlide()
  // }

  const lock = () => {
    if (!canvasObject.value) return
    lockElement((canvasObject.value as CanvasElement).id, true)
  }
  const combine = () => {
    if (!canvasObject.value) return
    combineElements()
  }

  const uncombine = () => {
    if (!canvasObject.value) return
    uncombineElements()
  }

  const remove = () => {
    if (canvasObject.value) {
      if (canvasObject.value.type === ElementNames.ACTIVE) {
        const activeElement = canvasObject.value as GroupElement
        activeElement.forEachObject(item => {
          deleteElement((item as CanvasElement).id)
        })
      }
      deleteElement((canvasObject.value as CanvasElement).id)
    }
    else if (thumbnailsFocus.value) deleteTemplate()
  }

  const move = (key: string) => {
    if (canvasObject.value) moveElement(key)
    else if (key === KEYS.UP || key === KEYS.DOWN) updateTemplateIndex(key)
  }

  // const moveSlide = (key: string) => {
  //   if (key === KEYS.PAGEUP) updateSlideIndex(KEYS.UP)
  //   else if (key === KEYS.PAGEDOWN) updateSlideIndex(KEYS.DOWN)
  // }

  // const order = (command: ElementOrderCommands) => {
  //   if (!handleElement.value) return
  //   orderElement(handleElement.value, command)
  // }

  // const create = () => {
  //   if (!thumbnailsFocus.value) return
  //   createSlide()
  // }

  // const tabActiveElement = () => {
  //   if (!currentSlide.value.elements.length) return
  //   if (!handleElementId.value) {
  //     const firstElement = currentSlide.value.elements[0]
  //     mainStore.setActiveElementIdList([firstElement.id])
  //     return
  //   }
  //   const currentIndex = currentSlide.value.elements.findIndex(el => el.id === handleElementId.value)
  //   const nextIndex = currentIndex >= currentSlide.value.elements.length - 1 ? 0 : currentIndex + 1
  //   const nextElementId = currentSlide.value.elements[nextIndex].id

  //   mainStore.setActiveElementIdList([nextElementId])
  // }

  const keydownListener = (e: KeyboardEvent) => {
    const { ctrlKey, shiftKey, altKey, metaKey } = e
    const ctrlOrMetaKeyActive = ctrlKey || metaKey
    
    const key = e.key.toUpperCase()

    if (ctrlOrMetaKeyActive && !ctrlKeyState.value) keyboardStore.setCtrlKeyState(true)
    if (shiftKey && !shiftKeyState.value) keyboardStore.setShiftKeyState(true)
    if (!disableHotkeys.value && key === KEYS.SPACE) keyboardStore.setSpaceKeyState(true)

    
    // if (ctrlOrMetaKeyActive && key === KEYS.P) {
    //   e.preventDefault()
    //   mainStore.setDialogForExport('pdf')
    //   return
    // }
    if (shiftKey && key === KEYS.F5) {
      e.preventDefault()
      keyboardStore.setShiftKeyState(false)
      return
    }

    if (ctrlOrMetaKeyActive && key === KEYS.C) {
      if (disableHotkeys.value) return
      e.preventDefault()
      copy()
    }
    if (ctrlOrMetaKeyActive && key === KEYS.V) {
      if (disableHotkeys.value) return
      e.preventDefault()
      patse()
    }
    if (ctrlOrMetaKeyActive && key === KEYS.X) {
      if (disableHotkeys.value) return
      e.preventDefault()
      cut()
    }
    if (ctrlOrMetaKeyActive && key === KEYS.D) {
      if (disableHotkeys.value) return
      e.preventDefault()
      // quickCopy()
    }
    if (ctrlOrMetaKeyActive && key === KEYS.Z) {
      if (disableHotkeys.value) return
      e.preventDefault()
      undo()
    }
    if (ctrlOrMetaKeyActive && key === KEYS.Y) {
      if (disableHotkeys.value) return
      e.preventDefault()
      redo()
    }
    if (ctrlOrMetaKeyActive && key === KEYS.A) {
      if (disableHotkeys.value) return
      e.preventDefault()
      // selectAll()
    }
    if (ctrlOrMetaKeyActive && key === KEYS.L) {
      if (disableHotkeys.value) return
      e.preventDefault()
      lock()
    }
    if (!shiftKey && ctrlOrMetaKeyActive && key === KEYS.G) {
      if (disableHotkeys.value) return
      e.preventDefault()
      combine()
    }
    if (shiftKey && ctrlOrMetaKeyActive && key === KEYS.G) {
      if (disableHotkeys.value) return
      e.preventDefault()
      uncombine()
    }
    if (altKey && key === KEYS.F) {
      if (disableHotkeys.value) return
      e.preventDefault()
      // order(ElementOrderCommands.TOP)
    }
    if (altKey && key === KEYS.B) {
      if (disableHotkeys.value) return
      e.preventDefault()
      // order(ElementOrderCommands.BOTTOM)
    }
    if (key === KEYS.DELETE) {
      if (disableHotkeys.value) return
      e.preventDefault()
      remove()
    }
    if (key === KEYS.UP) {
      if (disableHotkeys.value) return
      e.preventDefault()
      move(KEYS.UP)
    }
    if (key === KEYS.DOWN) {
      if (disableHotkeys.value) return
      e.preventDefault()
      move(KEYS.DOWN)
    }
    if (key === KEYS.LEFT) {
      if (disableHotkeys.value) return
      e.preventDefault()
      move(KEYS.LEFT)
    }
    if (key === KEYS.RIGHT) {
      if (disableHotkeys.value) return
      e.preventDefault()
      move(KEYS.RIGHT)
    }
    if (key === KEYS.PAGEUP) {
      if (disableHotkeys.value) return
      e.preventDefault()
      // moveSlide(KEYS.PAGEUP)
    }
    if (key === KEYS.PAGEDOWN) {
      if (disableHotkeys.value) return
      e.preventDefault()
      // moveSlide(KEYS.PAGEDOWN)
    }
    // if (key === KEYS.ENTER) {
    //   if (disableHotkeys.value) return
    //   e.preventDefault()
    //   enterElement()
    // }
    if (key === KEYS.MINUS) {
      if (disableHotkeys.value) return
      e.preventDefault()
      // scaleCanvas('-')
    }
    if (key === KEYS.EQUAL) {
      if (disableHotkeys.value) return
      e.preventDefault()
      // scaleCanvas('+')
    }
    if (key === KEYS.TAB) {
      if (disableHotkeys.value) return
      e.preventDefault()
      // tabActiveElement()
    }
  }
  
  const keyupListener = () => {
    if (ctrlKeyState.value) keyboardStore.setCtrlKeyState(false)
    if (shiftKeyState.value) keyboardStore.setShiftKeyState(false)
    if (spaceKeyState.value) keyboardStore.setSpaceKeyState(false)
  }

  onMounted(() => {
    document.addEventListener('keydown', keydownListener)
    document.addEventListener('keyup', keyupListener)
    window.addEventListener('blur', keyupListener)
  })
  onUnmounted(() => {
    document.removeEventListener('keydown', keydownListener)
    document.removeEventListener('keyup', keyupListener)
    window.removeEventListener('blur', keyupListener)
  })
}