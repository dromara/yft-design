import { reactive } from 'vue'
import { Object as FabricObject, ObjectRef } from 'fabric'


/**
 * 元素添加相应式属性
 */
const toRef = (object: FabricObject) => {
  if (object.ref) return object

  const keyArr: (keyof ObjectRef)[] = [
    'id',
    'name',
    'hideOnLayer',
    'originX',
    'originY',
    'top',
    'left',
    'width',
    'height',
    'scaleX',
    'scaleY',
    'flipX',
    'flipY',
    'opacity',
    'angle',
    'skewX',
    'skewY',
    'hoverCursor',
    'moveCursor',
    'padding',
    'borderColor',
    'borderDashArray',
    'cornerColor',
    'cornerStrokeColor',
    'cornerStyle',
    'cornerDashArray',
    'centeredScaling',
    'centeredRotation',
    'fill',
    'fillRule',
    'globalCompositeOperation',
    'backgroundColor',
    'selectionBackgroundColor',
    'stroke',
    'strokeWidth',
    'strokeDashArray',
    'strokeDashOffset',
    'strokeLineCap',
    'strokeLineJoin',
    'strokeMiterLimit',
    'shadow',
    'borderScaleFactor',
    'minScaleLimit',
    'selectable',
    'evented',
    'visible',
    'hasControls',
    'hasBorders',
    'perPixelTargetFind',
    'includeDefaultValues',
    'lockMovementX',
    'lockMovementY',
    'lockRotation',
    'lockScalingX',
    'lockScalingY',
    'lockSkewingX',
    'lockSkewingY',
    'lockScalingFlip',
    'excludeFromExport',
    'objectCaching',
    'noScaleCache',
    'strokeUniform',
    'dirty',
    'paintFirst',
    'activeOn',
    'colorProperties',
    'inverted',
    'absolutePositioned',
  ]

  if (object.isType('Rect')) {
    keyArr.push('rx', 'ry')
  }

  if (object.isType('Text', 'Textbox')) {
    keyArr.push(
      'text',
      'charSpacing',
      'lineHeight',
      'fontSize',
      'fontWeight',
      'fontFamily',
      'fontStyle',
      'pathSide',
      'pathAlign',
      'underline',
      'overline',
      'linethrough',
      'textAlign',
      'direction',
    )
  }

  object.ref = reactive({}) as ObjectRef

  keyArr.forEach(<K extends keyof ObjectRef>(key: K) => {
    object.ref[key] = object[key]

    Object.defineProperty(object, key, {
      get() {
        return this.ref[key]
      },
      set(value) {
        if (this.ref[key] === value) return
        this.ref[key] = value
      },
    })
  })

  return object
}

export { toRef }
