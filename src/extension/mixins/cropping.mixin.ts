import { containsPoint } from '@/utils/utility'
import { CLIPPATHS, ClipPathType } from '@/configs/images'
import { defaultControls } from '@/app/fabricControls'
import { fireCropImageEvent } from '@/extension/controls/cropping/cropping.controls.handlers'
import { config, Object as FabricObject, Path, util, Canvas, Point, TPointerEventInfo, TPointerEvent, Image, } from 'fabric'


export function isolateObjectForEdit(context: FabricObject) {
  const { canvas } = context
  if (!canvas) return
  context.hoverCursor = FabricObject.prototype.hoverCursor
  canvas.requestRenderAll();
  const deselect = context.onDeselect
  context.onDeselect = (...args: any) => {
    deselect.call(context, ...args)
    return true
  };
}
  

export function unisolateObjectForEdit(context: FabricObject) {
  const { canvas } = context
  if (!canvas) return
  canvas.requestRenderAll();
  const deselect = context.onDeselect
  context.onDeselect = (...args: any) => {
    deselect.call(context, ...args)
    return false;
  };
}


function canvasMouseUp() {
  // @ts-ignore
  delete this.__targetlessCanvasDrag;
   // @ts-ignore
  this.defaultCursor = this.__defaultCursor;
   // @ts-ignore
  delete this.__defaultCursor;
}


function canvasMouseDown(e: TPointerEventInfo<TPointerEvent>) {
  const target = e.target;
  // @ts-ignore
  const activeObject = this.getActiveObject()
  if (!activeObject) return;

  if ((!target || (activeObject.id !== target.id)) && activeObject.isCropping) {

    const { tlS, trS, blS, brS } = activeObject.oCoords;
    const vs = [
      { x: tlS.x, y: tlS.y },
      { x: trS.x, y: trS.y },
      { x: brS.x, y: brS.y },
      { x: blS.x, y: blS.y }
    ];
    if (activeObject.__corner) return
    const pointer = activeObject.canvas.getPointer(e, true);
    const checkClickInside = containsPoint(pointer, vs)
    if (checkClickInside) {
      activeObject.resetCropModeAnchors();
      activeObject.canvas.__targetlessCanvasDrag = true;
      activeObject.canvas.__defaultCursor = activeObject.canvas.defaultCursor;
      activeObject.canvas.defaultCursor = 'move';
      activeObject.canvas.selectable = false;
      activeObject.canvas.evented = false;
      return
    }
    if (activeObject.cropPath) {
      const clipPath = new Path(activeObject.cropPath)
      // clipPath.set({left: -clipPath.width/2, top: -clipPath.height/2})
      activeObject.set({clipPath, width: clipPath.width, height: clipPath.height})
    }
    activeObject.onDeselectEvent()
    activeObject.isCropping = false
    activeObject.canvas.defaultCursor = 'default'
    activeObject.canvas.renderAll()
  }
}

 
export function canvasMouseMove({ e }: TPointerEventInfo<MouseEvent>) {
   // @ts-ignore
  const activeObject = this.getActiveObject() as Image
  if (!activeObject || !activeObject.canvas?.__targetlessCanvasDrag || e.type !== 'mousemove' || !activeObject) {
    return;
  }
  const point = {
    x: e.movementX,
    y: e.movementY,
  };
  const objM = activeObject.calcTransformMatrix();
  const canvasM = activeObject.canvas.viewportTransform;
  const totalM = util.invertTransform(util.multiplyTransformMatrices(canvasM, objM));
  totalM[4] = 0;
  totalM[5] = 0;
  const transformedMovement = util.transformPoint(point, totalM);
  activeObject.cropX -= transformedMovement.x;
  activeObject.cropY -= transformedMovement.y;
  activeObject.fire('moving');
  activeObject.canvas.requestRenderAll();
}


export function addCropImageInteractions() {
  const cropping: any = {
    cropBorderColor: '#43b9d3',
    cropBorderScaleFactor: 2,
    cropCornerStyle: 'default',
    cropDarkLayer: '#16191e',
    cropLinesColor: '#f6f7fa',
    croppingBeforeVals: ['stroke', 'strokeWidth', 'cornerSize'], 
    bindCropModeHandlers() {
      this.unbindCropModeHandlers();
      this.on('moving', this.cropModeHandlerMoveImage);
      this.on('mousedown', this.resetCropModeAnchors);

      this.canvas.on('before:transform', this.cropBeforeHelper);
      this.canvas.on('mouse:up', canvasMouseUp);
      this.canvas.on('mouse:down', canvasMouseDown);
      this.canvas.on('mouse:move', canvasMouseMove);
      // window.addEventListener('mousedown', this.eventListener);
    },

    unbindCropModeHandlers() {
      this.off('moving', this.cropModeHandlerMoveImage);
      this.off('mousedown', this.resetCropModeAnchors);
      this.canvas.off('before:transform', this.cropBeforeHelper);
      this.canvas.off('mouse:up', canvasMouseUp);
      this.canvas.off('mouse:down', canvasMouseDown);
      this.canvas.off('mouse:move', canvasMouseMove);
      // window.removeEventListener('mousedown', this.eventListener);
    },

    onDeselectEvent() {
      const fabricCanvas = this.canvas
      if (!fabricCanvas) return
      unisolateObjectForEdit(this);
      delete this.lastEventTop;
      delete this.lastEventLeft;
      this.unbindCropModeHandlers();
      fabricCanvas.centeredKey = Canvas.prototype.centeredKey;
      fabricCanvas.altActionKey = Canvas.prototype.altActionKey;
      fabricCanvas.selection = true;
      this.controls = defaultControls()
      this.setCoords();
      fireCropImageEvent(this);
    },

    _drawDarkLayer(ctx: CanvasRenderingContext2D) {
      const shouldNotDraw = !this.isCropping && !this.isInPerspectiveMode
      if (shouldNotDraw || this === this.canvas.backgroundImage) return
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = this.cropDarkLayer;
      ctx.fillRect(0, 0, this.canvas.lowerCanvasEl.width, this.canvas.lowerCanvasEl.height);
      ctx.restore();
    },

    _drawCroppingLines(ctx: CanvasRenderingContext2D) {
      if (!this.__isCropping || !this.canvas || this.cropKey) {
        return;
      }
      const w = this.width;
      const h = this.height;
      const zoom = this.canvas.getZoom() * config.devicePixelRatio;
      ctx.save();
      ctx.lineWidth = 1;
      ctx.globalAlpha = 1;
      ctx.strokeStyle = this.cropLinesColor;
      ctx.beginPath();
      ctx.moveTo(-w / 2 + w / 3, -h / 2);
      ctx.lineTo(-w / 2 + w / 3, h / 2);
      ctx.moveTo(-w / 2 + 2 * w / 3, -h / 2);
      ctx.lineTo(-w / 2 + 2 * w / 3, h / 2);
      ctx.moveTo(-w / 2, -h / 2 + h / 3);
      ctx.lineTo(w / 2, -h / 2 + h / 3);
      ctx.moveTo(-w / 2, -h / 2 + 2 * h / 3);
      ctx.lineTo(w / 2, -h / 2 + 2 * h / 3);
      ctx.scale(1 / (this.scaleX * zoom), 1 / (this.scaleY * zoom));
      ctx.stroke();
      ctx.restore();
    },

    _drawCroppingPath(ctx: CanvasRenderingContext2D) {
      if (!this.__isCropping || !this.canvas || !this.cropKey) return
      const zoom = this.canvas.getZoom() * config.devicePixelRatio;
      ctx.save();
      ctx.lineWidth = 1;
      ctx.globalAlpha = 1;
      ctx.strokeStyle = this.cropLinesColor;;
      this.cropPath = CLIPPATHS[this.cropKey as ClipPathType].createPath(this.width, this.height)
      ctx.stroke(new Path2D(this.cropPath));
      ctx.scale(1 / (this.scaleX * zoom), 1 / (this.scaleY * zoom));
      ctx.restore();
    },

    resetCropModeAnchors() {
      this.lastEventTop = this.top;
      this.lastEventLeft = this.left;
      this.lastTop = undefined;
      this.lastLeft = undefined;
    },

    setupDragMatrix() {
      this.moveTransformationMatrix = util.invertTransform(this.calcTransformMatrix());
      this.changeToPositionMatrix = this.calcTransformMatrix().concat();
      this.moveTransformationMatrix[4] = 0;
      this.moveTransformationMatrix[5] = 0;
      this.changeToPositionMatrix[4] = 0;
      this.changeToPositionMatrix[5] = 0;
    },

    // this is a canvas level event. so `THIS` is the canvas
    cropBeforeHelper({ transform }: any) {
      // the idea here is to see how the image is positioned
      // and fix the corner that should not move.
      const { action, target } = transform;
      if (action.substring(0, 5) === 'scale') {
        // give us the current position of the opposite corner
        target.cropAnchorPoint = target.translateToOriginPoint(
          target.getCenterPoint(),
          transform.originX,
          transform.originY,
        );
      }
    },

    cropModeHandlerMoveImage() {
      if (!this.isCropping) {
        return;
      }
      const lastTop = this.lastTop === undefined ? this.lastEventTop : this.lastTop;
      const lastLeft = this.lastLeft === undefined ? this.lastEventLeft : this.lastLeft;
      const changeVector = new Point(lastLeft - this.left, lastTop - this.top);
      const correctMovement = util.transformPoint(changeVector, this.moveTransformationMatrix);
      const width = this._element.naturalWidth || this._element.width;
      const height = this._element.naturalHeight || this._element.height;
      const changeX = correctMovement.x;
      const changeY = correctMovement.y;
      let cropX = this.cropX + changeX;
      let cropY = this.cropY + changeY;
      const limitChangeVector = { x: changeX, y: changeY };
      if (cropX < 0) {
        limitChangeVector.x = -this.cropX;
        cropX = 0;
      } 
      else if (cropX + this.width > width) {
        cropX = width - this.width;
        limitChangeVector.x = width - this.cropX - this.width;
      }
      if (cropY < 0) {
        limitChangeVector.y = -this.cropY;
        cropY = 0;
      } 
      else if (cropY + this.height > height) {
        cropY = height - this.height;
        limitChangeVector.y = height - this.cropY - this.height;
      }
      this.cropX = cropX;
      this.cropY = cropY;
      this.lastTop = this.top;
      this.lastLeft = this.left;
      this.top = this.lastEventTop;
      this.left = this.lastEventLeft;
    },
  }
  return cropping
}