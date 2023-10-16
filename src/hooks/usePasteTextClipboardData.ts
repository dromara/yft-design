import { pasteCustomClipboardString } from '@/utils/clipboard'
import useHandleCreate from '@/hooks/useHandleCreate'
import useAddTemplateElement from '@/hooks/useAddTemplateElement'

interface PasteTextClipboardDataOptions {
  onlySlide?: boolean
  onlyElements?: boolean
}

export default () => {
  const { createTextElement } = useHandleCreate()
  const { addElementsFromData, addTemplatesFromData } = useAddTemplateElement()

  /**
   * 解析剪贴板内容，根据解析结果选择合适的粘贴方式
   * @param text 剪贴板内容
   * @param options 配置项：onlySlide -- 仅处理页面粘贴；onlyElements -- 仅处理元素粘贴；
   */
  const pasteTextClipboardData = (text: string, options?: PasteTextClipboardDataOptions) => {
    const onlySlide = options?.onlySlide || false
    const onlyElements = options?.onlyElements || false

    const clipboardData = pasteCustomClipboardString(text)

    // 元素或页面
    if (typeof clipboardData === 'object') {
      const { type, data } = clipboardData

      if (type === 'elements' && !onlySlide) addElementsFromData(data)
      else if (type === 'templates' && !onlyElements) addTemplatesFromData(data)
    }

    // 普通文本
    else if (!onlyElements && !onlySlide) {
      createTextElement(36)
    }
  }

  return {
    pasteTextClipboardData,
  }
}