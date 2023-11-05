import { ContextMenu } from '@/components/ContextMenu/types'
import { ElementNames, AlignCommand, LayerCommand } from '@/types/elements'
import { Object as FabricObject } from 'fabric'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import useHandleElement from '@/hooks/useHandleElement'
import useHandleTool from '@/hooks/useHandleTool'



export const contextMenuThumbnails = (): ContextMenu[] => {
  return [
    {
      text: '粘贴',
      subText: 'Ctrl + V',
      // handler: pasteSlide,
    },
    {
      text: '全选',
      subText: 'Ctrl + A',
      // handler: selectAllSlide,
    },
    {
      text: '新建页面',
      subText: 'Enter',
      // handler: createSlide,
    },
    {
      text: '页面预览',
      subText: 'F5',
      // handler: enterScreeningFromStart,
    },
  ]
}

export const contextMenus = (): ContextMenu[] => {
  const { lockElement, deleteElement } = useHandleElement()
  const { alignElement, layerElement } = useHandleTool()
  const { canvasObject } = storeToRefs(useMainStore())
  const element = canvasObject.value as FabricObject
  if (!element) {
    return [
      {
        text: '粘贴',
        subText: 'Ctrl + V',
        // handler: pasteSlide,
      },
      {
        text: '全选',
        subText: 'Ctrl + A',
        // handler: selectAllSlide,
      },
      {
        text: '标尺',
        // handler: createSlide,
      },
      {
        text: '网格',
        // handler: enterScreeningFromStart,
      },
      {
        text: '重置',
        // handler: enterScreeningFromStart,
      },
    ]
  }
  if (element.lockMovementX && element.lockMovementY) {
    return [{
      text: '解锁', 
      handler: () => lockElement(element.id, false),
    }]
  }

  return [
    {
      text: '剪切',
      subText: 'Ctrl + X',
      // handler: cutElement,
    },
    {
      text: '复制',
      subText: 'Ctrl + C',
      // handler: copyElement,
    },
    {
      text: '粘贴',
      subText: 'Ctrl + V',
      // handler: pasteElement,
    },
    { divider: true },
    {
      text: '水平居中',
      handler: () => alignElement(AlignCommand.HORIZONTAL),
      children: [
        { text: '垂直居中', handler: () => alignElement(AlignCommand.CENTER), },
        { text: '水平居中', handler: () => alignElement(AlignCommand.HORIZONTAL) },
        { text: '左对齐', handler: () => alignElement(AlignCommand.LEFT) },
        { text: '右对齐', handler: () => alignElement(AlignCommand.RIGHT) },
      ],
    },
    {
      text: '垂直居中',
      handler: () => alignElement(AlignCommand.VERTICAL),
      children: [
        { text: '水平居中', handler: () => alignElement(AlignCommand.CENTER) },
        { text: '垂直居中', handler: () => alignElement(AlignCommand.VERTICAL) },
        { text: '顶部对齐', handler: () => alignElement(AlignCommand.TOP) },
        { text: '底部对齐', handler: () => alignElement(AlignCommand.BOTTOM) },
      ],
    },
    { divider: true },
    {
      text: '置于顶层',
      // disable: props.isMultiSelect && !props.elementInfo.groupId,
      handler: () => layerElement(LayerCommand.TOP),
      children: [
        { text: '置于顶层', handler: () => layerElement(LayerCommand.TOP) },
        { text: '上移一层', handler: () => layerElement(LayerCommand.UP) },
      ],
    },
    {
      text: '置于底层',
      // disable: props.isMultiSelect && !props.elementInfo.groupId,
      handler: () => layerElement(LayerCommand.BOTTOM),
      children: [
        { text: '置于底层', handler: () => layerElement(LayerCommand.BOTTOM) },
        { text: '下移一层', handler: () => layerElement(LayerCommand.DOWN) },
      ],
    },
    { divider: true },
    {
      text: element.type === ElementNames.GROUP ? '取消组合' : '组合',
      subText: 'Ctrl + G',
      // handler: props.elementInfo.groupId ? uncombineElements : combineElements,
      // hide: !props.isMultiSelect,
    },
    {
      text: '全选',
      subText: 'Ctrl + A',
      // handler: selectAllElement,
    },
    {
      text: '锁定',
      subText: 'Ctrl + L',
      handler: () => lockElement(element.id, true),
    },
    {
      text: '删除',
      subText: 'Delete',
      handler: () => deleteElement(element.id),
    },
  ]
}

export const contextMenusThumbnails = (): ContextMenu[] => {
  return [
    {
      text: '剪切',
      subText: 'Ctrl + X',
      // handler: cutSlide,
    },
    {
      text: '复制',
      subText: 'Ctrl + C',
      // handler: copySlide,
    },
    {
      text: '粘贴',
      subText: 'Ctrl + V',
      // handler: pasteSlide,
    },
    {
      text: '全选',
      subText: 'Ctrl + A',
      // handler: selectAllSlide,
    },
    { divider: true },
    {
      text: '新建页面',
      subText: 'Enter',
      // handler: createSlide,
    },
    {
      text: '复制页面',
      subText: 'Ctrl + D',
      // handler: copyAndPasteSlide,
    },
    {
      text: '删除页面',
      subText: 'Delete',
      // handler: () => deleteSlide(),
    },
    { divider: true },
    {
      text: '从当前预览',
      subText: 'Shift + F5',
      // handler: enterScreening,
    },
  ]
}