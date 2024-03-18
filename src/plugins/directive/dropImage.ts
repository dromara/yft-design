import { DirectiveBinding, ObjectDirective } from "vue";
import useCanvas from "@/views/Canvas/useCanvas";
import { getImageDataURL, getImageText } from "@/utils/image";
import useHandleTemplate from "@/hooks/useHandleTemplate";
import useHandleCreate from "@/hooks/useHandleCreate";
import useCanvasScale from "@/hooks/useCanvasScale";
import { useTemplatesStore } from "@/store";
import { loadSVGFromString } from "fabric";
import { uploadFile } from "@/api/file";
// import axios from 'axios'; // 确保你已经安装并导入了axios

interface DropImageOptions {
  url?: string;
  highlightStyle?: Record<string, any>;
  uploadFunction?: (files: FileList) => void;
}

const applyStyle = (el: HTMLElement, style: Record<string, any>): void => {
  Object.entries(style).forEach(([property, value]) => {
    el.style[property as any] = value;
  });
};

const removeStyle = (el: HTMLElement, style: Record<string, any>): void => {
  Object.entries(style).forEach(async ([property, _]) => {
    el.style[property as any] = "";
  });
};

const defaultUpload = async (files: FileList, uploadUrl: string): Promise<void> => {
  const fileAccept = ".pdf,.psd,.cdr,.ai,.svg,.jpg,.jpeg,.png,.webp,.json";
  const { addTemplate } = useHandleTemplate();
  const { createImageElement } = useHandleCreate();
  const templatesStore = useTemplatesStore();
  const { setCanvasTransform } = useCanvasScale();
  Array.from(files).forEach(async (file) => {
    console.log("file", file);
    //   上传到服务端
    // const formData = new FormData();
    // formData.append('image', file);
    //   axios.post(uploadUrl, formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   })
    //     .then((response) => {
    //       // 这里可以触发某个事件或者调用回调
    //       console.log('Image uploaded: ', response.data);
    //     })
    //     .catch((error) => {
    //       console.error('Upload error: ', error);
    //     });

    const [canvas] = useCanvas();
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
    if (["jpg", "jpeg", "png", "webp"].includes(curFileSuffix as string)) {
      const dataURL = await getImageDataURL(file);
      createImageElement(dataURL);
    }
    const res1 = await uploadFile(file, curFileSuffix as string);
    if (res1 && res1.data.code === 200) {
      const template = res1.data.data;
      if (!template) return;
      await templatesStore.addTemplate(template);
      setCanvasTransform();
    }
  });
};

const dropImageDirective: ObjectDirective<HTMLElement, DropImageOptions> = {
  mounted(el, binding: DirectiveBinding<DropImageOptions>) {
    const highlightStyle = binding.value.highlightStyle || { backgroundColor: "#f0f0f0" };

    el.addEventListener("dragover", (event) => event.preventDefault());
    el.addEventListener("dragenter", () => applyStyle(el, highlightStyle));
    el.addEventListener("dragleave", () => removeStyle(el, highlightStyle));
    el.addEventListener("drop", (event) => {
      event.preventDefault();
      removeStyle(el, highlightStyle);
      const files = event.dataTransfer!.files;
      if (binding.value.uploadFunction && typeof binding.value.uploadFunction === "function") {
        binding.value.uploadFunction(files);
      } else if (binding.value.url) {
        defaultUpload(files, binding.value.url);
      }
    });
  },
};

export default dropImageDirective;
