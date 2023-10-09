// import * as fabric from 'fabric'
import { createTextboxDefaultControls } from '@/app/controls'
import { fireCropImageEvent } from '../controls/cropping/cropping.controls.handlers'
import { containsPoint } from '@/utils/utility'
import { config, Object as FabricObject, Path, util, Canvas, Point, TPointerEventInfo, TPointerEvent } from 'fabric'


export function isolateObjectForEdit(context: FabricObject) {
  const { canvas } = context;
  if (!canvas) return
  context.hoverCursor = FabricObject.prototype.hoverCursor;
  canvas.requestRenderAll();
  const deselect = context.onDeselect;
  // eslint-disable-next-line func-names
  context.onDeselect = (...args: any) => {
    // const index = canvas.getObjects().indexOf(context);
    deselect.call(context, ...args)
    return true;
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
    // @ts-ignore
    const pointer = this.getPointer(e, true);
    const checkClickInside = containsPoint(pointer, vs)
    if (checkClickInside) {
      activeObject.resetCropModeAnchors();
      // @ts-ignore
      this.__targetlessCanvasDrag = true;
      // @ts-ignore
      this.__defaultCursor = this.defaultCursor;
      // @ts-ignore
      this.defaultCursor = 'move';
      // @ts-ignore
      this.selectable = false;
      // @ts-ignore
      this.evented = false;
      return
    }
    if (activeObject.cropPath) {
      const clipPath = new Path('M 0 -100 A 50 50 0 1 1 0 100 A 50 50 0 1 1 0 -100 Z', {
        left: activeObject.cropX,
        top: activeObject.cropY,
      })
      console.log('clipPath:', clipPath)
      activeObject.set({clipPath, width: clipPath.width, height: clipPath.height})
    }
    
    activeObject.onDeselectEvent()
    activeObject.isCropping = false
    // @ts-ignore
    this.defaultCursor = 'default'
    // @ts-ignore
    this.renderAll()
  }
}

 
export function canvasMouseMove({ e }: TPointerEventInfo<MouseEvent>) {
   // @ts-ignore
  const fabricObject = this.getActiveObject();
   // @ts-ignore
  if (!this.__targetlessCanvasDrag || e.type !== 'mousemove' || !fabricObject) {
    return;
  }
  const point = {
    x: e.movementX,
    y: e.movementY,
  };
  const objM = fabricObject.calcTransformMatrix();
   // @ts-ignore
  const canvasM = this.viewportTransform;
  const totalM = util.invertTransform(util.multiplyTransformMatrices(canvasM, objM));
  totalM[4] = 0;
  totalM[5] = 0;
  const transformedMovement = util.transformPoint(point, totalM);
  fabricObject.cropX -= transformedMovement.x;
  fabricObject.cropY -= transformedMovement.y;
  fabricObject.fire('moving');
   // @ts-ignore
  this.requestRenderAll();
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
      this.controls = createTextboxDefaultControls()
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
      if (!this.isCropping || (this.canvas && (this.canvas.isCropping))) return
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
    // @ts-ignore
    cropBeforeHelper({ transform }) {
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
  // extend(prototype, cropping);
}

// export function extendWithCropImage(CropImage: fabric.Object) {
//   Object.defineProperty(CropImage, 'isCropping', {
//     get() {
//       return !!this.__isCropping;
//     },
//     set(value: boolean) {
//       console.log('value:', value)
//       const fabricCanvas = this.canvas;
//       if (!fabricCanvas) {
//         this.__isCropping = false;
//         return;
//       }
//       let { defaultCursor } = fabricCanvas;
//       value = !!value;
//       if (value === this.isCropping) return;
//       this.__isCropping = value
//       if (value) {
//         defaultCursor = fabricCanvas.defaultCursor;
//         fabricCanvas.defaultCursor = 'move';
//         isolateObjectForEdit(this);
//         this.lastEventTop = this.top;
//         this.lastEventLeft = this.left;
//         this.setupDragMatrix();
//         this.bindCropModeHandlers();
//         this.controls = croppingControlSet;
//         if (this.flipX && !this.flipY) {
//           this.controls = flipXCropControls;
//         }
//         if (this.flipY && !this.flipX) {
//           this.controls = flipYCropControls;
//         }
//         if (this.flipX && this.flipY) {
//           this.controls = flipXYCropControls;
//         }
//         if (this.scaleX != this.scaleY) {
//           this.setControlsVisibility({tlS: false, trS: false, blS: false, brS: false});
//         } 
//         else {
//           this.setControlsVisibility({tlS: true, trS: true, blS: true, brS: true});
//         }
//         this.setCoords();
//         fabricCanvas.centeredKey = null;
//         fabricCanvas.altActionKey = null;
//         fabricCanvas.selection = false;
//       } else {
//         fabricCanvas.defaultCursor = defaultCursor;
//         unisolateObjectForEdit(this);
//         delete this.lastEventTop;
//         delete this.lastEventLeft;
//         this.unbindCropModeHandlers();
//         fabricCanvas.centeredKey = fabric.Canvas.prototype.centeredKey;
//         fabricCanvas.altActionKey = fabric.Canvas.prototype.altActionKey;
//         fabricCanvas.selection = true;
//         this.controls = createTextboxDefaultControls()
//         this.setCoords();
//         fireCropImageEvent(this);
//       }
//     },
//   });

//   // addCropImageInteractions(CropImage);
// }