import { storeToRefs } from "pinia";
import { useFabricStore, useTemplatesStore } from "@/store";
import { useMainStore } from "@/store/modules/main";
import { RightStates, ElementNames } from "@/types/elements";
import { nanoid } from "nanoid";
import { QRCodeElement, QRCodeOption } from "@/types/canvas";
import { getImageSize } from "@/utils/image";
import JsBarcode from "jsbarcode";
import { Object as FabricObject, Path, classRegistry, XY, util, Image as FabricImage } from "fabric";
import { Textbox } from "@/extension/object/Textbox";
import { LinePoint } from "@/types/elements";
import { Image } from "@/extension/object/Image";
import { QRCode } from "@/extension/object/QRCode";
import { BarCode } from "@/extension/object/BarCode";
import useCenter from "@/views/Canvas/useCenter";
import useCanvas from "@/views/Canvas/useCanvas";
import useCanvasZindex from "./useCanvasZindex";
import { unref } from "vue";
import useI18n from "@/hooks/useI18n";

export default () => {
  const { t, locale } = useI18n();

  const mainStore = useMainStore();
  const templatesStore = useTemplatesStore();
  const { setZindex } = useCanvasZindex();
  const { rightState, systemFonts } = storeToRefs(mainStore);

  const renderCanvas = (element: FabricObject) => {
    const [canvas] = useCanvas();
    canvas.add(element);
    canvas.setActiveObject(element);
    rightState.value = RightStates.ELEMENT_STYLE;
    setZindex(canvas);
    canvas.renderAll();
    templatesStore.modifedElement();
  };

  const createTextElement = (fontSize: number, textStyle = "transverse", textHollow = false, textValue = t("default.textValue")) => {
    const { centerPoint } = useCenter();
    const _locale = unref(locale);
    const textBoxElement = new Textbox(textValue, {
      id: nanoid(10),
      left: _locale === "zh" ? centerPoint.x - (textValue.length * fontSize) / 2 : centerPoint.x,
      top: centerPoint.y - fontSize / 2,
      fontSize,
      fontFamily: systemFonts.value[0].value,
      fillType: 0,
      hasControls: true,
      hasBorders: true,
      fontWeight: "normal",
      charSpacing: 3,
      opacity: 1,
      lineHeight: 1.3,
      originX: "left",
      originY: "top",
      textAlign: "justify-center",
      name: ElementNames.TEXTBOX,
      splitByGrapheme: textStyle === "direction" ? true : false,
    });
    if (textHollow) {
      textBoxElement.fill = "";
      textBoxElement.stroke = "black";
      textBoxElement.strokeWidth = 1;
    }
    renderCanvas(textBoxElement);
  };

  const createPathElement = (path: string, left?: number, top?: number) => {
    const { centerPoint } = useCenter();
    const pathElement = new Path(path, {
      id: nanoid(10),
      left: left ? left : centerPoint.x,
      top: top ? top : centerPoint.y,
      hasControls: true,
      hasBorders: true,
      opacity: 1,
      originX: "left",
      originY: "top",
      fill: "#ff5e17",
      name: ElementNames.PATH,
    });
    pathElement.left -= pathElement.width / 2;
    pathElement.top -= pathElement.height / 2;
    renderCanvas(pathElement);
  };

  const createLineElement = (path: XY[], startStyle: LinePoint, endStyle: LinePoint, strokeDashArray?: [number, number]) => {
    // const { centerPoint } = useCenter()
    // const lineElement = new Line([0, 0, 300, 0], {
    //   id: nanoid(10),
    //   left: centerPoint.x,
    //   top: centerPoint.y,
    //   strokeWidth: 4,
    //   stroke: 'green',
    //   scaleX: 1,
    //   scaleY: 1,
    //   originX: 'left',
    //   originY: 'top',
    //   transparentCorners: false,
    // })
    // renderCanvas(lineElement)
    // canvas.add(lineElement)
    // canvas.setActiveObject(lineElement)
    // rightState.value = RightStates.ELEMENT_STYLE
    // templatesStore.modifedElement()
    // setZindex(canvas)
    createPolylineElement(path, startStyle, endStyle, strokeDashArray);
    // createArrowElement(path)
  };

  const createPolylineElement = (path: XY[], startStyle: LinePoint, endStyle: LinePoint, strokeDashArray?: [number, number]) => {
    const { centerPoint } = useCenter();
    // const points = [ { x: 0, y: 0 }, { x: 200, y: 0 } ]
    const Polyline = classRegistry.getClass("Polyline");

    const element = new Polyline(path, {
      id: nanoid(10),
      left: centerPoint.x,
      top: centerPoint.y,
      strokeWidth: 4,
      stroke: "pink",
      fill: "",
      scaleX: 1,
      scaleY: 1,
      originX: "left",
      originY: "top",
      startStyle,
      endStyle,
      hasBorders: false,
      objectCaching: false,
      transparentCorners: false,
      strokeDashArray,
      name: ElementNames.LINE,
    });
    renderCanvas(element);
  };

  const createImageElement = (url: string) => {
    const { zoom } = storeToRefs(useFabricStore());
    const { currentTemplateWidth, currentTemplateHeight } = storeToRefs(useTemplatesStore());
    const { centerPoint } = useCenter();
    const [canvas] = useCanvas();
    getImageSize(url).then(async ({ width, height }) => {
      const scale = height / width;
      let imageScale = 1;
      if (scale < zoom.value && width > currentTemplateWidth.value) {
        imageScale = currentTemplateWidth.value / width;
      } else if (height > currentTemplateHeight.value) {
        imageScale = currentTemplateHeight.value / height;
      }
      const imageElement = await Image.fromURL(url, {
        id: nanoid(10),
        angle: 0,
        left: centerPoint.x - (width * imageScale) / 2,
        top: centerPoint.y - (height * imageScale) / 2,
        scaleX: imageScale,
        scaleY: imageScale,
        hasControls: true,
        hasBorders: true,
        opacity: 1,
        originX: "left",
        originY: "top",
        borderColor: "#ff8d23",
        name: ElementNames.IMAGE,
        crossOrigin: "anonymous",
      });
      renderCanvas(imageElement);
    });
  };

  const createQRCodeElement = async (url: string, codeOption: QRCodeOption, codeContent?: string) => {
    const { centerPoint } = useCenter();
    // const QRCode = classRegistry.getClass('QRCode')
    const codeObject = (await QRCode.fromURL(url, {
      id: nanoid(10),
      name: ElementNames.QRCODE,
      angle: 0,
      left: centerPoint.x,
      top: centerPoint.y,
      hasControls: true,
      hasBorders: true,
      opacity: 1,
      originX: "left",
      originY: "top",
      borderColor: "#ff8d23",
      codeContent,
      codeOption,
      crossOrigin: "anonymous",
    })) as QRCodeElement;
    console.log("codeObject", codeObject);
    codeObject.left -= codeObject.width / 2;
    codeObject.top -= codeObject.height / 2;
    renderCanvas(codeObject);
  };

  const createBarCodeElement = async (url: string, codeContent: string, codeOption: JsBarcode.BaseOptions) => {
    const { centerPoint } = useCenter();
    // const Barcode = classRegistry.getClass('BarCode')
    const barcodeObject = await BarCode.fromURL(url, {
      id: nanoid(10),
      name: ElementNames.BARCODE,
      angle: 0,
      left: centerPoint.x,
      top: centerPoint.y,
      hasControls: true,
      hasBorders: true,
      opacity: 1,
      originX: "left",
      originY: "top",
      borderColor: "#ff8d23",
      codeContent,
      codeOption,
      crossOrigin: "anonymous",
    });
    barcodeObject.left -= barcodeObject.width / 2;
    barcodeObject.top -= barcodeObject.height / 2;

    renderCanvas(barcodeObject);
  };

  const createVideoElement = (url: string) => {
    const { centerPoint } = useCenter();
    const [canvas] = useCanvas();
    const videoEl = document.createElement("video");
    videoEl.loop = true;
    videoEl.crossOrigin = "anonymous";
    videoEl.controls = true;
    videoEl.style.display = "none";

    const sourceEl = document.createElement("source");
    sourceEl.src = url;
    videoEl.appendChild(sourceEl);

    videoEl.addEventListener("loadeddata", function () {
      videoEl.width = videoEl.videoWidth;
      videoEl.height = videoEl.videoHeight;
      const video1 = new FabricImage(videoEl, {
        left: centerPoint.x,
        top: centerPoint.y,
        originX: "center",
        originY: "center",
        objectCaching: false,
      });
      canvas.add(video1);
      video1.getElement().play();
      util.requestAnimFrame(function render() {
        canvas.renderAll();
        util.requestAnimFrame(render);
      });
    });
  };

  return {
    createTextElement,
    createPathElement,
    createLineElement,
    createImageElement,
    createQRCodeElement,
    createBarCodeElement,
    createVideoElement,
  };
};
