import { computed } from "vue"
import { DefaultVersion } from "@/configs/size"
import { useMainStore, useTemplatesStore } from "@/store"
import { Template } from "@/types/canvas"
import { nanoid } from "nanoid"
import { storeToRefs } from "pinia"
import { copyText, readClipboard } from "@/utils/clipboard"
import { encrypt } from "@/utils/crypto"
import { ElMessage } from 'element-plus'
import { KEYS } from '@/configs/hotkey'
import { WorkSpaceDrawType, CanvasBackground } from "@/configs/canvas"
import usePasteTextClipboardData from '@/hooks/usePasteTextClipboardData'



export default () => {
  const templatesStore = useTemplatesStore()
  const mainStore = useMainStore()
  const { templates, templateIndex, currentTemplate } = storeToRefs(templatesStore)
  // const mainStore = useMainStore()
  // const slidesStore = useSlidesStore()
  const { selectedTemplatesIndex: _selectedTemplatesIndex } = storeToRefs(mainStore)
  // const { currentSlide, templates, theme, slideIndex } = storeToRefs(templatesStore)

  const selectedTemplatesIndex = computed(() => [..._selectedTemplatesIndex.value, templateIndex.value])
  const selectedTemplates = computed(() => templates.value.filter((item, index) => selectedTemplatesIndex.value.includes(index)))
  const selectedTemplatesId = computed(() => selectedTemplates.value.map(item => item.id))

  const { pasteTextClipboardData } = usePasteTextClipboardData()

  const getEmptyTemplate = (): Template => {
    const emptyTemplate: Template = {
      id: nanoid(10),
      version: DefaultVersion,
      zoom: currentTemplate.value.zoom,
      width: currentTemplate.value.width,
      height: currentTemplate.value.height,
      clip: currentTemplate.value.clip,
      objects: currentTemplate.value.objects.filter(item => item.id === WorkSpaceDrawType),
      workSpace: {
        fillType: 0,
        left: 0,
        top: 0,
        angle: 0,
        scaleX: 1,
        scaleY: 1,
      },
      background: CanvasBackground
    }
    return emptyTemplate
  }

  // // 重置页面
  const resetTemplate = async () => {
    templatesStore.setTemplateIndex(0)
    templatesStore.setTemplates([getEmptyTemplate()])
    await templatesStore.renderTemplate()
  }

  /**
   * 移动页面焦点
   * @param command 移动页面焦点命令：上移、下移
   */
  const updateTemplateIndex = async (command: string) => {
    if (command === KEYS.UP && templateIndex.value > 0) {
      templatesStore.setTemplateIndex(templateIndex.value - 1)
    }
    else if (command === KEYS.DOWN && templateIndex.value < templates.value.length - 1) {
      templatesStore.setTemplateIndex(templateIndex.value + 1)
    }
    await templatesStore.renderTemplate()
  }

  // 将当前页面数据加密后复制到剪贴板
  const copyTemplate = () => {
    const text = encrypt(JSON.stringify({
      type: 'slides',
      data: selectedTemplates.value,
    }))
    copyText(text).then(() => {
      mainStore.setThumbnailsFocus(true)
    })
  }

  // 尝试将剪贴板页面数据解密后添加到下一页（粘贴）
  const pasteTemplate = () => {
    readClipboard().then(text => {
      pasteTextClipboardData(text, { onlySlide: true })
    }).catch(err => ElMessage({
      message: err,
      type: 'warning'
    }))
  }

  // 创建一页空白页并添加到下一页
  const createTemplate = async () => {
    await templatesStore.addTemplate(getEmptyTemplate())
    templatesStore.setTemplateIndex(templateIndex.value)
    await templatesStore.renderTemplate()
  }

  const addTemplate = async (template: Template) => {
    await templatesStore.addTemplate(template)
    templatesStore.setTemplateIndex(templateIndex.value)
    await templatesStore.renderTemplate()
  }

  // // 根据模板创建新页面
  // const createSlideByTemplate = (slides: Slide[]) => {
  //   for (let i = 0; i < slides.length; i++) {
  //     const slide = slides[i]
  //     const { groupIdMap, elIdMap } = createElementIdMap(slide.elements)

  //     for (const element of slide.elements) {
  //       element.id = elIdMap[element.id]
  //       if (element.groupId) element.groupId = groupIdMap[element.groupId]
  //     }
  //     const newSlide = {
  //       ...slide,
  //       id: nanoid(10),
  //     }
  //     slidesStore.addSlide(newSlide)
  //     
  //   }
  // }

  // // 将当前页复制一份到下一页
  // const copyAndPasteSlide = () => {
  //   const slide = JSON.parse(JSON.stringify(currentSlide.value))
  //   addSlidesFromData([slide])
  // }

  // 删除当前页，若将删除全部页面，则执行重置页面操作
  const deleteTemplate = (targetTamplatesId = selectedTemplatesId.value) => {
    if (templates.value.length === targetTamplatesId.length) resetTemplate()
    else templatesStore.deleteTemplate(targetTamplatesId)
    mainStore.updateSelectedTemplatesIndex([])
  }

  // 将当前页复制后删除（剪切）
  // 由于复制操作会导致多选状态消失，所以需要提前将需要删除的页面ID进行缓存
  const cutTemplate = () => {
    const targetSlidesId = [...selectedTemplatesId.value]
    copyTemplate()
    deleteTemplate(targetSlidesId)
  }

  // 选中全部页面
  const selectAllSlide = () => {
    const newSelectedSlidesIndex = Array.from(Array(templates.value.length), (item, index) => index)
    mainStore.updateSelectedTemplatesIndex(newSelectedSlidesIndex)
  }

  // 拖拽调整页面顺序同步数据
  const sortTemplates = (newIndex: number, oldIndex: number) => {
    if (oldIndex === newIndex) return
  
    const _templates = JSON.parse(JSON.stringify(templates.value))
    const _template = _templates[oldIndex]
    _templates.splice(oldIndex, 1)
    _templates.splice(newIndex, 0, _template)
    templatesStore.setTemplates(_templates)
    templatesStore.setTemplateIndex(newIndex)
    templatesStore.renderElement()
  }

  return {
    resetTemplate,
    updateTemplateIndex,
    copyTemplate,
    pasteTemplate,
    createTemplate,
    // createSlideByTemplate,
    // copyAndPasteSlide,
    deleteTemplate,
    cutTemplate,
    addTemplate,
    sortTemplates,
  }
}