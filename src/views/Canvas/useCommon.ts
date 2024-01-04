import { useFabricStore, useTemplatesStore } from "@/store"
import { DefaultDPI, DefaultRatio } from '@/configs/size'
import { storeToRefs } from "pinia"
import {
  WorkSpaceClipType,
  WorkSpaceDrawType,
  WorkSpaceMaskType,
  WorkSpaceSafeType,
  WorkSpaceClipColor,
  WorkSpaceSafeColor,
  WorkSpaceMaskColor,
  WorkSpaceThumbType,
  WorkSpaceCommonOption,
} from '@/configs/canvas'
import { Line, Group, Rect, Path } from 'fabric'
import { LineOption } from '@/types/canvas'
import { TransparentFill } from '@/configs/background'
import useCanvas from "./useCanvas"

export default () => {
  const initCommon = () => {
    const [canvas] = useCanvas()
    if (!canvas) return
    const workSpaceDraw = canvas.getObjects().filter(ele => ele.id === WorkSpaceDrawType)[0]
    if (!workSpaceDraw) return
    const fabricStore = useFabricStore()
    const templatesStore = useTemplatesStore()
    const { currentTemplate } = storeToRefs(templatesStore)
    const { clip, safe, diagonal, opacity, showClip, showSafe } = storeToRefs(fabricStore)
    canvas.remove(...canvas.getObjects().filter(ele => WorkSpaceThumbType.includes(ele.id)))
    // const workWidth = currentTemplate.value.width / currentTemplate.value.zoom
    // const workHeight = currentTemplate.value.height / currentTemplate.value.zoom
    const workWidth = workSpaceDraw.width, workHeight = workSpaceDraw.height
    const Padding = 50000, PaddingHalf = Padding / 2
    const clipPX = clip.value * DefaultDPI / DefaultRatio
    const diagonalPX = diagonal.value * DefaultDPI / DefaultRatio
    const safePX = 2 * safe.value * DefaultDPI / DefaultRatio
    const left = workSpaceDraw.left, top = workSpaceDraw.top

    const workSpaceClip = new Rect({
      left: left + clipPX,
      top: top + clipPX,
      width: workWidth - 2 * clipPX,
      height: workHeight - 2 * clipPX,
      fill: TransparentFill,
      stroke: WorkSpaceClipColor, // 边框颜色
      strokeWidth: 1, // 边框大小
      visible: showClip.value,
      id: WorkSpaceClipType,
      ...WorkSpaceCommonOption
    })

    const workSpaceSafe = new Rect({
      left: left + safePX,
      top: top + safePX,
      width: workWidth - 2 * safePX,
      height: workHeight - 2 * safePX,
      fill: TransparentFill,
      stroke: WorkSpaceSafeColor, // 边框颜色
      strokeWidth: 1, // 边框大小
      visible: showSafe.value,
      id: WorkSpaceSafeType,
      ...WorkSpaceCommonOption
    })

    const maskPath = `M0 0 L${Padding} 0 L${Padding} ${Padding} L0 ${Padding} L0 0 Z 
    M${PaddingHalf + left} ${PaddingHalf + top} 
    L${PaddingHalf + left} ${PaddingHalf + top + workHeight} 
    L${PaddingHalf + left + workWidth} ${PaddingHalf + top + workHeight} 
    L${PaddingHalf + left + workWidth} ${PaddingHalf + top} 
    L${PaddingHalf + left} ${PaddingHalf + top} Z`

    const workSpaceMask = new Path(maskPath, {
      left: -PaddingHalf,
      top: -PaddingHalf,
      fill: WorkSpaceMaskColor,
      opacity: opacity.value,
      id: WorkSpaceMaskType,
      originX: 'left',
      originY: 'top',
      ...WorkSpaceCommonOption
    })
    // [lineEnd, lineHeight, leftStart, top] 终止位置，线长，起始位置，top
    const diagonalHalfPX = diagonalPX / 2
    const diagonals: LineOption[] = [
      // 左上水平
      [PaddingHalf - diagonalHalfPX - clipPX, PaddingHalf + clipPX, PaddingHalf - diagonalHalfPX / 2 - clipPX, PaddingHalf + clipPX],
      // 左上垂直
      [PaddingHalf, PaddingHalf - diagonalHalfPX, PaddingHalf, PaddingHalf - diagonalHalfPX / 2],

      // 左下水平
      [PaddingHalf - diagonalHalfPX - clipPX, PaddingHalf + workHeight - clipPX, PaddingHalf - diagonalHalfPX / 2 - clipPX, PaddingHalf + workHeight - clipPX],
      // 左下垂直
      [PaddingHalf, PaddingHalf + diagonalHalfPX + workHeight, PaddingHalf, PaddingHalf + workHeight + diagonalHalfPX / 2],

      // 右上水平
      [PaddingHalf + workWidth + clipPX, PaddingHalf + clipPX, PaddingHalf + workWidth + diagonalHalfPX / 2 + clipPX, PaddingHalf + clipPX],
      // 右上垂直
      [PaddingHalf + workWidth - clipPX * 2, PaddingHalf - diagonalHalfPX, PaddingHalf + workWidth - clipPX * 2, PaddingHalf - diagonalHalfPX / 2],

      // 右下水平
      [PaddingHalf + workWidth + clipPX, PaddingHalf + workHeight - clipPX, PaddingHalf + workWidth + diagonalHalfPX / 2 + clipPX, PaddingHalf + workHeight - clipPX],
      // 右下垂直
      [PaddingHalf + workWidth - clipPX * 2, PaddingHalf + diagonalHalfPX + workHeight, PaddingHalf + workWidth - clipPX * 2, PaddingHalf + workHeight + diagonalHalfPX / 2]
    ]
    const diagonalLines: Line[] = []
    diagonals.forEach(line => {
      const diagonalLine = new Line(line, {
        selectable: false,
        hoverCursor: 'default',
        evented: false,
        excludeFromExport: false,
        hasBorders: false,
        perPixelTargetFind: true,
        strokeWidth: 1,
        stroke: WorkSpaceClipColor,
      })
      diagonalLines.push(diagonalLine)
    })

    const workLineGroup = new Group([...diagonalLines], {
      // @ts-ignore
      id: WorkSpaceClipType,
      left: left - diagonalHalfPX,
      top: top - diagonalHalfPX,
      visible: showClip.value,
      ...WorkSpaceCommonOption
    })
    
    canvas.add(workSpaceClip)
    canvas.add(workSpaceSafe)
    canvas.add(workLineGroup)
    canvas.add(workSpaceMask)
    canvas.renderAll()
  }

  return {
    initCommon
  }
}