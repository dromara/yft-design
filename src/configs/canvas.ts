export const WorkSpaceDrawType = 'WorkSpaceDrawType'
export const WorkSpaceClipType = 'WorkSpaceClipType'
export const WorkSpaceSafeType = 'WorkSpaceSafeType'
export const WorkSpaceMaskType = 'WorkSpaceMaskType'
export const WorkSpaceLineType = 'WorkSpaceLineType'

// 分割服
export const Separator = '.'

// 固定元素
export const WorkSpaceName = 'YFT-DRAW'


// 数据库id
export const LocalStorageDiscardedKey = 'YFT_DISCARD_DB'

// 画布编辑颜色
export const WorkSpaceEditColor = 'rgba(255,255,255,1)'

// 画布蒙版颜色
export const WorkSpaceMaskColor = '#f3f3f3'

// 画布裁切颜色
export const WorkSpaceClipColor = 'red'

// 画布安全颜色
export const WorkSpaceSafeColor = 'yellow'

// 画布公共参数
export const WorkSpaceCommonOption = {
  originX: 'left',
  originY: 'top',
  selectable: false,
  transparentCorners: false,
  evented: false,
  // excludeFromExport: true,
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

export const toObjectFilter = [
  'id', 
  'name', 
  'isShow',
  'isCheck',
  'color', 
  'isCrop', 
  'cropId', 
  'fill',
  'fillType', 
  'fillURL', 
  'fillRepeat', 
  'lockMovementX', 
  'lockMovementY', 
  'objectCaching',
  'transparentCorners',
  'codeStyle',
  'codeContent',
  'codeSpace',
  'codeError',
  'background',
  'selectable',
  'evented'
]