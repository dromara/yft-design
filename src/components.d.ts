import { Object as FabricObject, Control as FabricControl } from "fabric"
import type { FabricObject, Point, TPointerEventInfo, TPointerEvent, Rect } from '@fabric'
import type { FabricObjectProps as FabricObjectPropsOrigin } from 'fabric/src/shapes/Object/types/FabricObjectProps'
import type { GroupOwnProps } from 'fabric/src/shapes/Group'
import { LinePoint, Mask } from "./types/elements"
import { EffectItem } from "./types/common"

export declare module 'fabric' {
  export declare type ObjectRef = Pick<
    FabricObject,
    | 'id'
    | 'name'
    | 'hideOnLayer'
    | 'originX'
    | 'originY'
    | 'top'
    | 'left'
    | 'width'
    | 'height'
    | 'scaleX'
    | 'scaleY'
    | 'flipX'
    | 'flipY'
    | 'opacity'
    | 'angle'
    | 'skewX'
    | 'skewY'
    | 'hoverCursor'
    | 'moveCursor'
    | 'padding'
    | 'borderColor'
    | 'borderDashArray'
    | 'cornerColor'
    | 'cornerStrokeColor'
    | 'cornerStyle'
    | 'cornerDashArray'
    | 'centeredScaling'
    | 'centeredRotation'
    | 'fill'
    | 'fillRule'
    | 'globalCompositeOperation'
    | 'backgroundColor'
    | 'selectionBackgroundColor'
    | 'stroke'
    | 'strokeWidth'
    | 'strokeDashArray'
    | 'strokeDashOffset'
    | 'strokeLineCap'
    | 'strokeLineJoin'
    | 'strokeMiterLimit'
    | 'shadow'
    | 'borderScaleFactor'
    | 'minScaleLimit'
    | 'selectable'
    | 'evented'
    | 'visible'
    | 'hasControls'
    | 'hasBorders'
    | 'perPixelTargetFind'
    | 'includeDefaultValues'
    | 'lockMovementX'
    | 'lockMovementY'
    | 'lockRotation'
    | 'lockScalingX'
    | 'lockScalingY'
    | 'lockSkewingX'
    | 'lockSkewingY'
    | 'lockScalingFlip'
    | 'excludeFromExport'
    | 'objectCaching'
    | 'noScaleCache'
    | 'strokeUniform'
    | 'dirty'
    | 'paintFirst'
    | 'activeOn'
    | 'colorProperties'
    | 'inverted'
    | 'absolutePositioned'
    | 'text'
    | 'charSpacing'
    | 'lineHeight'
    | 'fontSize'
    | 'fontWeight'
    | 'fontFamily'
    | 'fontStyle'
    | 'pathSide'
    | 'pathAlign'
    | 'underline'
    | 'overline'
    | 'linethrough'
    | 'textAlign'
    | 'direction'
  > &
    Pick<Rect, 'rx' | 'ry'>
  
  export declare class Observable<EventSpec> {
    on(eventName: 'referenceline:moving' | 'referenceline:mouseup', handler: (event: { e: Event; target: ReferenceLine }) => void): T;
    on(events: { [key: EventName]: (event: { e: Event; target: fabric.GuideLine }) => void }): T;
    // on<K extends keyof EventSpec, E extends EventSpec[K]>(eventName: K, handler: TEventCallback<E>): VoidFunction;
    // on<K extends string, E>(eventName: K, handler: TEventCallback<E>): VoidFunction;
    // on<K extends keyof EventSpec, E extends EventSpec[K]>(handlers: EventRegistryObject<K, E>): VoidFunction;
  }

  export declare class Canvas {
    __targetlessCanvasDrag?: boolean
    _objects: FabricObject[]
    ref: {
      zoom: Ref<number>
      objects: ComputedRef<FabricObject[]>
    }
    forEachObject(
      callback: (object: FabricObject, index: number, array: FabricObject[]) => any,
    ): void
    getObjects(...types: string[]): FabricObject[]
    absolutePan(point: Point, skipSetCoords?: boolean): void
    relativePan(point: Point, skipSetCoords?: boolean): void
    zoomToPoint(point: Point, value: number, skipSetCoords?: boolean): void

    on(eventName: EventName, handler: (e: IEvent<MouseEvent>) => void): void;
    on(options: any): void;
    off(eventName: EventName, handler?: (e: IEvent<MouseEvent>) => void): void;
    fire<T>(eventName: EventName, options?: any): T;
  }

  export declare class ActiveSelection {
    multiSelectAdd(...targets: FabricObject[]): void
    getObjects(...types: string[]): FabricObject[]
    forEachObject(
      callback: (object: FabricObject, index: number, array: FabricObject[]) => any,
    ): void
  }

  export declare class Group {
    id: string
    name: string
    canvas: Canvas | undefined
    group: this | undefined
    isShow: boolean
    objects: FabricObject[]
    subTargets: FabricObject[]
    _objects: FabricObject[]
    setDirty(): void
    updateLayout(): void
    forEachObject(callback: (object: FabricObject, index: number, array: FabricObject[]) => any): void
    getObjects(): FabricObject[]
    onActiveTarget(target: FabricObject): void
    addDeselectedEvent(object: FabricObject): void
    doubleClickHandler(e: TPointerEventInfo<TPointerEvent>): void
  }

  export declare class Object {
    group: Group | undefined
    id: string
    name: string
    layer?: string
    effects?: EffectItem[]
    ref: ObjectRef
    getParent<T extends boolean = false>(strict?: T): T extends true ? Group | undefined : Group | Canvas | StaticCanvas
    noEventObjectAdded: boolean /** 不发送 object:added 事件 */
    getWidthHeight(noFixed?: boolean): Point
    getHeight(): number
    getWidth(): number
    getLeftTop(): Point
    getLeft(): number
    getTop(): number
    setHeight(height: number): void
    setWidth(width: number): void
    setAngle(angle: number): void
    setLeftTop(point: Point): void
    setLeft(left: number): void
    setTop(top: number): void
    toObject(propertiesToInclude?: any[]): any
    _type: string
    type: string
    _stateProperties: any
    isType<T = boolean>(...types: string[]): this is T
    hideOnLayer: boolean /** 在图层上隐藏 */
  }

  export declare class Image {
    originSrc?: string 
    effects?: EffectItem[]
    mask?: Mask
    lastEventTop: number
    lastEventLeft: number
    setupDragMatrix(): void
    renderEffects(type?: string): void
    bindCropModeHandlers(): void
    _drawCroppingLines(ctx: CanvasRenderingContext2D): void
    _drawCroppingPath(ctx: CanvasRenderingContext2D): void
  }

  export declare class IText {
    renderEffects(type?: string): void
  }

  export declare class Textbox {
    color: string
  }


  export declare class Polygon {
    startStyle: LinePoint
    endStyle: LinePoint
    pointMoving(index: number, point: Point): Point
  }

  export declare class Line {
    setLineMode(value: string, model: 'start' | 'end'): void
  }

  type ExportedKeys =
    | 'crossOrigin'
    | 'offsetX'
    | 'offsetY'
    | 'patternTransform'
    | 'repeat'
    | 'source'
    | 'fit'
  export declare type PatternOptions = Partial<Pick<Pattern, ExportedKeys>>

  export declare class Pattern {
    constructor(options?: PatternOptions)
    /** 契合度 */
    fit: 'fill' | 'padding' | 'clip' | 'repeat'
  }

  export declare class StaticCanvas {
    _objects: FabricObject[]
    getObjects(): FabricObject[]
  }

  export declare interface FabricObjectProps extends FabricObjectPropsOrigin {
    id: string
    name: string
  }

  export declare interface SerializedObjectProps {
    id: string
    name: string
    type: string
  }

  export declare interface GroupProps extends FabricObjectProps, GroupOwnProps { }

  export declare class Control extends FabricControl {
    pointIndex?: number
  }
}

export declare namespace fabric {
  export * from 'fabric'
}

declare global {
  interface Window {
    queryLocalFonts(): any[];
    gifler: any
  }

  declare type Recordable<T = any> = Record<string, T>;
}
