import { CanvasElement, TextboxElement } from '@/types/canvas'
import { ElementNames } from '@/types/elements'
import useCanvas, { toggleSelection } from '@/views/Canvas/useCanvas'
import { defineStore } from 'pinia'
import { useMainStore } from './main'

export interface KeyboardState {
  ctrlKeyState: boolean
  shiftKeyState: boolean
  spaceKeyState: boolean
}

export const useKeyboardStore = defineStore('keyboard', {
  state: (): KeyboardState => ({
    ctrlKeyState: false, // ctrl键按下状态
    shiftKeyState: false, // shift键按下状态
    spaceKeyState: false, // space键按下状态
  }),

  getters: {
    ctrlOrShiftKeyActive(state) {
      return state.ctrlKeyState || state.shiftKeyState
    },
  },

  actions: {
    setCtrlKeyState(active: boolean) {
      this.ctrlKeyState = active
    },
    setShiftKeyState(active: boolean) {
      this.shiftKeyState = active
    },
    setSpaceKeyState(active: boolean) {
      const [ canvas ] = useCanvas()
      const mainStore = useMainStore()
      const activeObject = canvas.getActiveObject() as CanvasElement
      if (activeObject && activeObject.type === ElementNames.TEXTBOX && (activeObject as TextboxElement).isEditing) return
      this.spaceKeyState = active
      
      // canvas.defaultCursor = 'default'
      toggleSelection(!active)
      if (active) {
        mainStore.setCanvasObject(null)
        canvas.discardActiveObject()
        // canvas.defaultCursor = 'pointer'
        // canvas.setCursor('pointer')
      } 
      // else {
      //   canvas.setCursor('default')
      // }
      canvas.renderAll()
    }
  },
})