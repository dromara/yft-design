export const WorkSpaceDrawType = 'WorkSpaceDrawType'
export const WorkSpaceClipType = 'WorkSpaceClipType'
export const WorkSpaceSafeType = 'WorkSpaceSafeType'
export const WorkSpaceMaskType = 'WorkSpaceMaskType'
export const WorkSpaceLineType = 'WorkSpaceLineType'

export const WorkSpaceCommonType = [
  WorkSpaceDrawType, WorkSpaceClipType, WorkSpaceSafeType, WorkSpaceMaskType, WorkSpaceLineType
]

export const WorkSpaceThumbType = [
  WorkSpaceClipType, WorkSpaceSafeType, WorkSpaceMaskType, WorkSpaceLineType
]

// 分割服
export const Separator = '.'

// 固定元素
export const WorkSpaceName = 'YFT-DRAW'

// 
export const CropLinesColor = '#f6f7fa'

// 数据库id
export const LocalStorageDiscardedKey = 'YFT_DISCARD_DB'

// 画布编辑颜色
export const WorkSpaceEditColor = 'rgba(255,255,255,1)'

// 画布蒙版颜色
export const WorkSpaceMaskColor = '#f3f3f3'

// 画布背景颜色
export const CanvasBackground = 'rgba(255,255,255,0)'

// 画布裁切颜色
export const WorkSpaceClipColor = 'red'

// 画布安全颜色
export const WorkSpaceSafeColor = 'yellow'

// 画布公共参数
export const WorkSpaceCommonOption = {
  selectable: false,
  transparentCorners: false,
  evented: false,
  excludeFromExport: true,
  hasControls: false,
  hasBorders: false,
  perPixelTargetFind: false,
  // absolutePositioned: true,
  lockMovementX: true,
  lockMovementY: true,
  lockRotation: true,
  lockScalingX: true,
  lockScalingY: true,
  lockUniScaling: true,
  hoverCursor: 'default',
  name: WorkSpaceName,
}

export const propertiesToInclude = [
  'id', 
  'name', 
  'isShow',
  'isCheck',
  'color', 
  'axis',
  'cropKey', 
  'cropPath', 
  'cropSize', 
  'fill',
  'selectable',
  'evented',
  'fillType', 
  'fillURL', 
  'fillRepeat', 
  'lockMovementX', 
  'lockMovementY', 
  'objectCaching',
  'transparentCorners',
  'codeOption',
  'codeContent',
  'background',
  'hasBorders',
  'originSrc',
]