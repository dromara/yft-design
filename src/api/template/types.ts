export interface ItemInfo {
  id: number
  title: string
  text: string
  /** 图片路径 */
  photo: string
  /** 图片的宽度，前端获取图片信息之后设置 */
  width?: number
  /** 图片的高度，前端获取图片信息之后设置 */
  height?: number
  /** 
   * 当前节点的所在列的高度
   * - 非列的总高度，只是调试用
   */
  currentColumnHeight?: number
}

export type ItemList = Array<ItemInfo>;

export interface PageParams {
  page: number
  size: number
}

export interface infoParams {
  pk: number
}

export interface TemplateItem {
  id: number
  previewURL: string
  previewWidth: number
  previewHeight: number
  data: string
  title: string
  text: string
}

export interface PageResult {
  total: number
  page: number
  total_pages: number
  size: number
  pages: number
  items: TemplateItem[]
}

export interface TemplateResult {
  code: number
  data: PageResult
  msg: string
}

export interface TemplateInfo {
  code: number
  data: TemplateItem
  msg: string
}
