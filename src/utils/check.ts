import { Object as FabricObject, ActiveSelection, Gradient, Pattern, Text, Group, Canvas, Circle } from 'fabric'
import { util as utilOrgin, Group as NativeGroup } from 'fabric'


const isActiveSelection = (thing: unknown): thing is ActiveSelection => {
  return thing instanceof ActiveSelection
}

const isCircle = (thing: unknown): thing is Circle => {
  return thing instanceof Circle
}
  
const isGroup = (thing?: unknown): thing is Group => {
  return thing instanceof Group
}
  
const isCollection = (thing?: unknown): thing is Group | ActiveSelection | Canvas => {
  return !!thing && Array.isArray((thing as Group)._objects)
}

const isNativeGroup = (thing?: unknown): thing is NativeGroup => {
  return thing instanceof NativeGroup
}
  
const isGradient = (thing: unknown): thing is Gradient<'linear' | 'radial'> => {
  return thing instanceof Gradient
}
  
const isPattern = (thing: unknown): thing is Pattern => {
  return thing instanceof Pattern
}

const isTextObject = (thing?: FabricObject): thing is Text => {
  return !!thing && thing.isType('Text', 'IText', 'Textbox', 'ArcText')
}
  
// const isFiller = (filler: TFiller | string | null): filler is TFiller => {
//     return !!filler && (filler as TFiller).toLive !== undefined
// }
  
// const isSerializableFiller = (filler: TFiller | string | null): filler is TFiller => {
//     return !!filler && typeof (filler as TFiller).toObject === 'function'
// }
  
export const check = {
  isCollection,
  isGradient,
  isPattern,
  isActiveSelection,
  isTextObject,
  isGroup,
  isNativeGroup,
  isCircle
}
  