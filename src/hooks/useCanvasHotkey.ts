import { storeToRefs } from "pinia";
import { useMainStore, useTemplatesStore, useKeyboardStore } from "@/store";
import { KEYS } from "@/configs/hotkey";
import useHandleCreate from "@/hooks/useHandleCreate";
import useCanvasScale from "@/hooks/useCanvasScale";
import useCanvas from "@/views/Canvas/useCanvas";
import { loadSVGFromString } from "fabric";
import { getImageDataURL, getImageText } from "@/utils/image";
import { uploadFile } from "@/api/file";
import useHandleTemplate from "./useHandleTemplate";
import useHandleElement from "./useHandleElement";
import useHistorySnapshot from "./useHistorySnapshot";
import { CanvasElement, GroupElement } from "@/types/canvas";
import { ElementNames } from "@/types/elements";

export default () => {
  const mainStore = useMainStore();
  const keyboardStore = useKeyboardStore();
  const templatesStore = useTemplatesStore();
  const { disableHotkeys, handleElement, canvasObject, handleElementId, thumbnailsFocus, drawAreaFocus } = storeToRefs(mainStore);
  const { currentTemplate, templateIndex } = storeToRefs(templatesStore);
  const { ctrlKeyState, shiftKeyState, spaceKeyState } = storeToRefs(keyboardStore);

  const { copyTemplate, cutTemplate, deleteTemplate, updateTemplateIndex } = useHandleTemplate();

  const { copyElement, cutElement, patseEelement, deleteElement, moveElement, lockElement, combineElements, uncombineElements } = useHandleElement();
  const { createImageElement, createTextElement } = useHandleCreate();
  // const { selectAllElement } = useSelectAllElement()
  // const { moveElement } = useMoveElement()
  // const { orderElement } = useOrderElement()

  const { redo, undo } = useHistorySnapshot();
  // const { enterScreening, enterScreeningFromStart } = useScreening()
  // const { scaleCanvas, resetCanvas } = useScaleCanvas()

  const copy = () => {
    if (canvasObject.value) copyElement();
    else if (thumbnailsFocus.value) copyTemplate();
  };

  const cut = () => {
    if (canvasObject.value) cutElement();
    else if (thumbnailsFocus.value) cutTemplate();
  };

  const patse = () => {
    if (canvasObject.value) patseEelement();
    else if (thumbnailsFocus.value) copyTemplate();
  };

  // const quickCopy = () => {
  //   if (activeElementIdList.value.length) quickCopyElement()
  //   else if (thumbnailsFocus.value) copyAndPasteSlide()
  // }

  // const selectAll = () => {
  //   if (editorAreaFocus.value) selectAllElement()
  //   if (thumbnailsFocus.value) selectAllSlide()
  // }

  const lock = () => {
    if (!canvasObject.value) return;
    lockElement((canvasObject.value as CanvasElement).id, true);
  };
  const combine = () => {
    if (!canvasObject.value) return;
    combineElements();
  };

  const uncombine = () => {
    if (!canvasObject.value) return;
    uncombineElements();
  };

  const remove = () => {
    if (canvasObject.value) {
      if (canvasObject.value.type === ElementNames.ACTIVE) {
        const activeElement = canvasObject.value as GroupElement;
        activeElement.forEachObject((item) => {
          deleteElement((item as CanvasElement).id);
        });
      } else {
        deleteElement(canvasObject.value.id);
      }
    } else if (thumbnailsFocus.value) deleteTemplate();
  };

  const move = (key: string) => {
    if (canvasObject.value) moveElement(key);
    else if (key === KEYS.UP || key === KEYS.DOWN) updateTemplateIndex(key);
  };

  // const moveSlide = (key: string) => {
  //   if (key === KEYS.PAGEUP) updateSlideIndex(KEYS.UP)
  //   else if (key === KEYS.PAGEDOWN) updateSlideIndex(KEYS.DOWN)
  // }

  // const order = (command: ElementOrderCommands) => {
  //   if (!handleElement.value) return
  //   orderElement(handleElement.value, command)
  // }

  // const create = () => {
  //   if (!thumbnailsFocus.value) return
  //   createSlide()
  // }

  // const tabActiveElement = () => {
  //   if (!currentSlide.value.elements.length) return
  //   if (!handleElementId.value) {
  //     const firstElement = currentSlide.value.elements[0]
  //     return
  //   }
  //   const currentIndex = currentSlide.value.elements.findIndex(el => el.id === handleElementId.value)
  //   const nextIndex = currentIndex >= currentSlide.value.elements.length - 1 ? 0 : currentIndex + 1
  //   const nextElementId = currentSlide.value.elements[nextIndex].id

  // }

  const keydownListener = (e: KeyboardEvent) => {
    const [canvas] = useCanvas();
    const { ctrlKey, shiftKey, altKey, metaKey } = e;
    const ctrlOrMetaKeyActive = ctrlKey || metaKey;

    const key = e.key.toUpperCase();

    if (ctrlOrMetaKeyActive && !ctrlKeyState.value) keyboardStore.setCtrlKeyState(true);
    if (shiftKey && !shiftKeyState.value) keyboardStore.setShiftKeyState(true);
    if (!disableHotkeys.value && key === KEYS.SPACE) keyboardStore.setSpaceKeyState(true);

    // if (ctrlOrMetaKeyActive && key === KEYS.P) {
    //   e.preventDefault()
    //   mainStore.setDialogForExport('pdf')
    //   return
    // }
    if (shiftKey && key === KEYS.F5) {
      e.preventDefault();
      keyboardStore.setShiftKeyState(false);
      return;
    }

    if (ctrlOrMetaKeyActive && key === KEYS.C) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      copy();
    }
    // if (ctrlOrMetaKeyActive && key === KEYS.V) {
    //   if (disableHotkeys.value) return
    //   e.preventDefault()
    //   patse()
    // }
    if (ctrlOrMetaKeyActive && key === KEYS.X) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      cut();
    }
    if (ctrlOrMetaKeyActive && key === KEYS.D) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      // quickCopy()
    }
    if (ctrlOrMetaKeyActive && key === KEYS.Z) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      undo();
    }
    if (ctrlOrMetaKeyActive && key === KEYS.Y) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      redo();
    }
    if (ctrlOrMetaKeyActive && key === KEYS.A) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      // selectAll()
    }
    if (ctrlOrMetaKeyActive && key === KEYS.L) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      lock();
    }
    if (!shiftKey && ctrlOrMetaKeyActive && key === KEYS.G) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      combine();
    }
    if (shiftKey && ctrlOrMetaKeyActive && key === KEYS.G) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      uncombine();
    }
    if (altKey && key === KEYS.F) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      // order(ElementOrderCommands.TOP)
    }
    if (altKey && key === KEYS.B) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      // order(ElementOrderCommands.BOTTOM)
    }
    if (key === KEYS.DELETE) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      remove();
    }
    if (key === KEYS.UP) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      move(KEYS.UP);
    }
    if (key === KEYS.DOWN) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      move(KEYS.DOWN);
    }
    if (key === KEYS.LEFT) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      move(KEYS.LEFT);
    }
    if (key === KEYS.RIGHT) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      move(KEYS.RIGHT);
    }
    if (key === KEYS.PAGEUP) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      // moveSlide(KEYS.PAGEUP)
    }
    if (key === KEYS.PAGEDOWN) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      // moveSlide(KEYS.PAGEDOWN)
    }
    // if (key === KEYS.ENTER) {
    //   if (disableHotkeys.value) return
    //   e.preventDefault()
    //   enterElement()
    // }
    if (key === KEYS.MINUS) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      // scaleCanvas('-')
    }
    if (key === KEYS.EQUAL) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      // scaleCanvas('+')
    }
    if (key === KEYS.TAB) {
      if (disableHotkeys.value) return;
      e.preventDefault();
      // tabActiveElement()
    }
    if (shiftKey && key === KEYS.R) {
      console.log("key:", key);
      if (disableHotkeys.value) return;
      e.preventDefault();
      if (canvas.ruler) {
        canvas.ruler.enabled = !canvas.ruler.enabled;
      }
    }
  };

  const keyupListener = () => {
    if (ctrlKeyState.value) keyboardStore.setCtrlKeyState(false);
    if (shiftKeyState.value) keyboardStore.setShiftKeyState(false);
    if (spaceKeyState.value) keyboardStore.setSpaceKeyState(false);
  };

  const pasteListener = async (event: { preventDefault: () => void; clipboardData: any; originalEvent: { clipboardData: any } }) => {
    const [canvas] = useCanvas();
    event.preventDefault(); // 阻止默认粘贴行为

    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    const fileAccept = ".pdf,.psd,.cdr,.ai,.svg,.jpg,.jpeg,.png,.webp,.json";
    const { addTemplate } = useHandleTemplate();
    const { setCanvasTransform } = useCanvasScale();
    for (let item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        const curFileSuffix: string | undefined = file.name.split(".").pop();
        if (!fileAccept.split(",").includes(`.${curFileSuffix}`)) return;
        if (curFileSuffix === "svg") {
          const dataText = await getImageText(file);
          const content = await loadSVGFromString(dataText);
          canvas.add(...content.objects);
          canvas.renderAll();
        }
        if (curFileSuffix === "json") {
          const dataText = await getImageText(file);
          const template = JSON.parse(dataText);
          addTemplate(template);
        }
        if (item.type.indexOf("image/") === 0) {
          // 这是一个图片文件
          const imageUrl = URL.createObjectURL(file);
          createImageElement(imageUrl);
        }
        const res1 = await uploadFile(file, curFileSuffix as string);
        if (res1 && res1.data.code === 200) {
          const template = res1.data.data;
          if (!template) return;
          await templatesStore.addTemplate(template);
          setCanvasTransform();
        }
      } else if (item.kind === "string" && item.type.indexOf("text/plain") === 0) {
        // 文本数据
        item.getAsString((text: any) => {
          // 插入到文本框
          const activeObject = canvas.getActiveObject();
          // 如果是激活的文字把复制的内容插入到对应光标位置
          if (activeObject && (activeObject.type === "textbox" || activeObject.type === "i-text")) {
            const cursorPosition = activeObject.selectionStart;
            const textBeforeCursorPosition = activeObject.text.substring(0, cursorPosition);
            const textAfterCursorPosition = activeObject.text.substring(cursorPosition);

            // 更新文本对象的文本
            activeObject.set("text", textBeforeCursorPosition + text + textAfterCursorPosition);

            // 重新设置光标的位置
            activeObject.selectionStart = cursorPosition + text.length;
            activeObject.selectionEnd = cursorPosition + text.length;

            // 重新渲染画布展示更新后的文本
            activeObject.dirty = true;
            canvas.renderAll();
          } else {
            createTextElement(50, undefined, false, text);
          }
        });
      }
    }
  };

  return {
    keydownListener,
    keyupListener,
    pasteListener,
  };
};
