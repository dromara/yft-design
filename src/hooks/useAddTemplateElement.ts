import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useTemplatesStore, useMainStore } from '@/store'
import { createTemplateIdMap, createElementIdMap } from '@/utils/element'
import { CanvasElement, Template } from '@/types/canvas'
import { ElementNames } from '@/types/elements'

export default () => {
  const mainStore = useMainStore()
  const templatesStore = useTemplatesStore()
  const { currentTemplate } = storeToRefs(templatesStore)

  /**
   * 添加指定的元素数据（一组）
   * @param elements 元素列表数据
   */
  const addElementsFromData = (elements: CanvasOption[]) => {
    const { groupIdMap, elIdMap } = createElementIdMap(elements)
    const currenttemplateElementIdList = currentTemplate.value.objects.map(el => el.id)
    
    for (const element of elements) {
      const inCurrenttemplate = currenttemplateElementIdList.includes(element.id)
      
      element.id = elIdMap[element.id]

      if (inCurrenttemplate && element.left && element.top) {
        element.left = element.left + 10
        element.top = element.top + 10
      }

      if (element.type === ElementNames.GROUP) element.id = groupIdMap[element.id]
    }
    templatesStore.addElement(elements)
  }

  /**
   * 添加指定的页面数据
   * @param template 页面数据
   */
  const addTemplatesFromData = (templates: Template[]) => {
    const templateIdMap = createTemplateIdMap(templates)
    const newtemplates = templates.map(template => {
      const { groupIdMap, elIdMap } = createElementIdMap(template.objects)

      for (const element of template.objects) {
        element.id = elIdMap[element.id]
      }
      
      return {
        ...template,
        id: templateIdMap[template.id],
      }
    })
    templatesStore.addTemplate(newtemplates)
  }

  return {
    addElementsFromData,
    addTemplatesFromData,
  }
}