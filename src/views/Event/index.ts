import useCanvas from "@/views/Canvas/useCanvas"
import { useMouseDown } from './useMouseDown'
import { useMouseMove } from './useMouseMove'
import { useMouseUp } from './useMouseUp'
import { useMouseWheel } from './useMouseWheel'
import { useBeforeRender } from './useBeforeRender'
import { useAfterRender } from './useAfterRender'
import { useMouseOver } from './useMouseOver'
import { useMouseOut } from './useMouseOut'
import { useMousedblClick } from './useMousedblClick'
import { useObjectMoving } from './useObjectMoving'
import { useObjectModifed } from './useObjectModifed'
import { useSelectionCleared } from "./useSelectionCleared"
import { useSelectionUpdated } from "./useSelectionUpdated"
import { useTextEditingExited } from "./useTextEditingExited"

export const initEvent = () => {
  const [ canvas ] = useCanvas()
  if (!canvas) return
  canvas.on('mouse:down', useMouseDown)
  canvas.on('mouse:up', useMouseUp)
  // canvas.on('mouse:move', useMouseMove)
  
  // canvas.on('mouse:wheel', useMouseWheel)
  // canvas.on('mouse:over', useMouseOver)
  // canvas.on('mouse:out', useMouseOut)
  // canvas.on('mouse:dblclick', useMousedblClick)
  // canvas.on('before:render', useBeforeRender)
  // canvas.on('after:render', useAfterRender)
  // canvas.on('object:moving', useObjectMoving)
  canvas.on('object:modified', useObjectModifed)
  // canvas.on('selection:cleared', useSelectionCleared)
  // canvas.on('selection:updated', useSelectionUpdated)
  // canvas.on('text:editing:exited', useTextEditingExited)
  // usePointerDown()
  // usePointerMove()
}
