import * as fabric from 'fabric';
import {
    cropFromTop,
    cropFromTopFlig,
    cropFromLeft,
    cropFromLeftFlig,
    cropFromRight,
    cropFromRightFlig,
    cropFromBottom,
    cropFromBottomFlig,
    cropFromBottomLeft,
    cropFromBottomRight,
    cropFromTopLeft,
    cropFromTopRight,
    imageCornerBL,
    imageCornerBR,
    imageCornerTL,
    imageCornerTR,
    scaleEquallyCropBL,
    scaleEquallyCropBR,
    scaleEquallyCropTL,
    scaleEquallyCropTR,
    scaleEquallyCropTLFlig,
    scaleEquallyCropBRFlig,
    scaleEquallyCropTRFlig,
    scaleEquallyCropBLFlig
  } from './cropping.controls.handlers';
  import {
    renderCropCorner,
    renderCropMiddle,
    renderWithShadows
  } from './cropping.controls.renders';
  
  const { scaleCursorStyleHandler, renderCircleControl } = fabric.controlsUtils;
  
  const renderCropTL = renderWithShadows(2, 2, renderCropCorner);
  const renderCropTR = renderWithShadows(-2, 2, renderCropCorner);
  const renderCropBL = renderWithShadows(2, -2, renderCropCorner);
  const renderCropBR = renderWithShadows(-2, -2, renderCropCorner);
  const renderCropMT = renderWithShadows(0, 2, renderCropMiddle);
  const renderCropMB = renderWithShadows(0, -2, renderCropMiddle);
  const renderCropML = renderWithShadows(2, 0, renderCropMiddle);
  const renderCropMR = renderWithShadows(-2, 0, renderCropMiddle);
  
  export const croppingControlSet = {
    tlS: new fabric.Control({
      x: -0.5, y: -0.5,
      actionName: 'tlS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerTL,
      actionHandler: scaleEquallyCropTL,
      render: renderCircleControl,
    }),
    trS: new fabric.Control({
      x: 0.5, y: -0.5,
      actionName: 'trS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerTR,
      actionHandler: scaleEquallyCropTR,
      render: renderCircleControl,
    }),
    blS: new fabric.Control({
      x: -0.5, y: 0.5,
      actionName: 'blS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerBL,
      actionHandler: scaleEquallyCropBL,
      render: renderCircleControl,
    }),
    brS: new fabric.Control({
      x: 0.5, y: 0.5,
      actionName: 'brS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerBR,
      actionHandler: scaleEquallyCropBR,
      render: renderCircleControl,
    }),
    cropLeft: new fabric.Control({
      x: -0.5, y: 0,
      actionName: 'cropLeft',
      render: renderCropML,
      actionHandler: cropFromLeft,
      angle: 90,
    }),
    cropRight: new fabric.Control({
      x: 0.5, y: 0,
      actionName: 'cropRight',
      render: renderCropMR,
      actionHandler: cropFromRight,
      angle: 90,
    }),
    cropTop: new fabric.Control({
      x: 0, y: -0.5,
      actionName: 'cropTop',
      render: renderCropMT,
      actionHandler: cropFromTop,
    }),
    cropBottom: new fabric.Control({
      x: 0, y: 0.5,
      actionName: 'cropBottom',
      render: renderCropMB,
      actionHandler: cropFromBottom,
    }),
    cropCornerTL: new fabric.Control({
      x: -0.5, y: -0.5,
      actionName: 'cropCornerTL',
      render: renderCropTL,
      actionHandler: cropFromTopLeft,
    }),
    cropCornerBL: new fabric.Control({
      x: -0.5, y: 0.5,
      actionName: 'cropCornerBL',
      render: renderCropBL,
      angle: 270,
      actionHandler: cropFromBottomLeft,
    }),
    cropCornerBR: new fabric.Control({
      x: 0.5, y: 0.5,
      actionName: 'cropCornerBR',
      render: renderCropBR,
      angle: 180,
      actionHandler: cropFromBottomRight,
    }),
    cropCornerTR: new fabric.Control({
      x: 0.5, y: -0.5,
      actionName: 'cropCornerTR',
      render: renderCropTR,
      angle: 90,
      actionHandler: cropFromTopRight,
    }),
  };
  
  // const fabricObjectControls = fabric.Object.prototype.controls;
  
  export const standardControlSet = fabric.Object.prototype.controls;
  
  export const flipXCropControls = {
    tlS: new fabric.Control({
      x: -0.5,
      y: -0.5,
      actionName: 'tlS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerTR,
      actionHandler: scaleEquallyCropTR,
      render: renderCircleControl,
    }),
    trS: new fabric.Control({
      x: 0.5,
      y: -0.5,
      actionName: 'trS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerTL,
      actionHandler: scaleEquallyCropTL,
      render: renderCircleControl,
    }),
    blS: new fabric.Control({
      x: -0.5,
      y: 0.5,
      actionName: 'blS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerBR,
      actionHandler: scaleEquallyCropBR,
      render: renderCircleControl,
    }),
    brS: new fabric.Control({
      x: 0.5,
      y: 0.5,
      actionName: 'brS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerBL,
      actionHandler: scaleEquallyCropBL,
      render: renderCircleControl,
    }),
    cropLeft: new fabric.Control({
      x: -0.5, y: 0,
      actionName: 'cropLeft',
      render: renderCropML,
      actionHandler: cropFromLeftFlig,
      angle: 90,
    }),
    cropRight: new fabric.Control({
      x: 0.5, y: 0,
      actionName: 'cropRight',
      render: renderCropMR,
      actionHandler: cropFromRightFlig,
      angle: 90,
    }),
    cropTop: new fabric.Control({
      x: 0, y: -0.5,
      actionName: 'cropTop',
      render: renderCropMT,
      actionHandler: cropFromTop,
    }),
    cropBottom: new fabric.Control({
      x: 0, y: 0.5,
      actionName: 'cropBottom',
      render: renderCropMB,
      actionHandler: cropFromBottom,
    }),
    cropCornerTL: new fabric.Control({
      x: -0.5, y: -0.5,
      actionName: 'cropCornerTL',
      render: renderCropTL,
      actionHandler: cropFromTopLeft,
    }),
    cropCornerBL: new fabric.Control({
      x: -0.5, y: 0.5,
      actionName: 'cropCornerBL',
      render: renderCropBL,
      angle: 270,
      actionHandler: cropFromBottomLeft,
    }),
    cropCornerBR: new fabric.Control({
      x: 0.5, y: 0.5,
      actionName: 'cropCornerBR',
      render: renderCropBR,
      angle: 180,
      actionHandler: cropFromBottomRight,
    }),
    cropCornerTR: new fabric.Control({
      x: 0.5, y: -0.5,
      actionName: 'cropCornerTR',
      render: renderCropTR,
      angle: 90,
      actionHandler: cropFromTopRight,
    }),
  };
  
  export const flipYCropControls = {
    tlS: new fabric.Control({
      x: -0.5,
      y: -0.5,
      actionName: 'tlS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerBL,
      actionHandler: scaleEquallyCropBL,
      render: renderCircleControl,
    }),
    trS: new fabric.Control({
      x: 0.5,
      y: -0.5,
      actionName: 'trS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerBR,
      actionHandler: scaleEquallyCropBR,
      render: renderCircleControl,
    }),
    blS: new fabric.Control({
      x: -0.5,
      y: 0.5,
      actionName: 'blS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerTL,
      actionHandler: scaleEquallyCropTL,
      render: renderCircleControl,
    }),
    brS: new fabric.Control({
      x: 0.5,
      y: 0.5,
      actionName: 'brS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerTR,
      actionHandler: scaleEquallyCropTR,
      render: renderCircleControl,
    }),
    cropLeft: new fabric.Control({
      x: -0.5, y: 0,
      actionName: 'cropLeft',
      render: renderCropML,
      actionHandler: cropFromLeft,
      angle: 90,
    }),
    cropRight: new fabric.Control({
      x: 0.5, y: 0,
      actionName: 'cropRight',
      render: renderCropMR,
      actionHandler: cropFromRight,
      angle: 90,
    }),
    cropTop: new fabric.Control({
      x: 0, y: -0.5,
      actionName: 'cropTop',
      render: renderCropMT,
      actionHandler: cropFromTopFlig,
    }),
    cropBottom: new fabric.Control({
      x: 0, y: 0.5,
      actionName: 'cropBottom',
      render: renderCropMB,
      actionHandler: cropFromBottomFlig,
    }),
    cropCornerTL: new fabric.Control({
      x: -0.5, y: -0.5,
      actionName: 'cropCornerTL',
      render: renderCropTL,
      actionHandler: cropFromTopLeft,
    }),
    cropCornerBL: new fabric.Control({
      x: -0.5, y: 0.5,
      actionName: 'cropCornerBL',
      render: renderCropBL,
      angle: 270,
      actionHandler: cropFromBottomLeft,
    }),
    cropCornerBR: new fabric.Control({
      x: 0.5, y: 0.5,
      actionName: 'cropCornerBR',
      render: renderCropBR,
      angle: 180,
      actionHandler: cropFromBottomRight,
    }),
    cropCornerTR: new fabric.Control({
      x: 0.5, y: -0.5,
      actionName: 'cropCornerTR',
      render: renderCropTR,
      angle: 90,
      actionHandler: cropFromTopRight,
    }),
  };
  
  export const flipXYCropControls = {
    tlS: new fabric.Control({
      x: -0.5,
      y: -0.5,
      actionName: 'tlS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerBR,
      actionHandler: scaleEquallyCropTLFlig,
      render: renderCircleControl,
    }),
    trS: new fabric.Control({
      x: 0.5,
      y: -0.5,
      actionName: 'trS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerBL,
      actionHandler: scaleEquallyCropTRFlig,
      render: renderCircleControl,
    }),
    blS: new fabric.Control({
      x: -0.5,
      y: 0.5,
      actionName: 'blS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerTR,
      actionHandler: scaleEquallyCropBLFlig,
      render: renderCircleControl,
    }),
    brS: new fabric.Control({
      x: 0.5,
      y: 0.5,
      actionName: 'brS',
      cursorStyleHandler: scaleCursorStyleHandler,
      positionHandler: imageCornerTL,
      actionHandler: scaleEquallyCropBRFlig,
      render: renderCircleControl,
    }),
    cropLeft: new fabric.Control({
      x: -0.5, y: 0,
      actionName: 'cropLeft',
      render: renderCropML,
      actionHandler: cropFromLeftFlig,
      angle: 90,
    }),
    cropRight: new fabric.Control({
      x: 0.5, y: 0,
      actionName: 'cropRight',
      render: renderCropMR,
      actionHandler: cropFromRightFlig,
      angle: 90,
    }),
    cropTop: new fabric.Control({
      x: 0, y: -0.5,
      actionName: 'cropTop',
      render: renderCropMT,
      actionHandler: cropFromTopFlig,
    }),
    cropBottom: new fabric.Control({
      x: 0, y: 0.5,
      actionName: 'cropBottom',
      render: renderCropMB,
      actionHandler: cropFromBottomFlig,
    }),
    cropCornerTL: new fabric.Control({
      x: -0.5, y: -0.5,
      actionName: 'cropCornerTL',
      render: renderCropTL,
      actionHandler: cropFromTopLeft,
    }),
    cropCornerBL: new fabric.Control({
      x: -0.5, y: 0.5,
      actionName: 'cropCornerBL',
      render: renderCropBL,
      angle: 270,
      actionHandler: cropFromBottomLeft,
    }),
    cropCornerBR: new fabric.Control({
      x: 0.5, y: 0.5,
      actionName: 'cropCornerBR',
      render: renderCropBR,
      angle: 180,
      actionHandler: cropFromBottomRight,
    }),
    cropCornerTR: new fabric.Control({
      x: 0.5, y: -0.5,
      actionName: 'cropCornerTR',
      render: renderCropTR,
      angle: 90,
      actionHandler: cropFromTopRight,
    }),
  };
  