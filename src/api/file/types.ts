import { Template } from "@/types/canvas"

export interface SVGInfo {
  width: number
  height: number
  index: number
  svg: string
}

export interface UploadResult {
  code: number
  msg: string
  file: string
  svg: SVGInfo[]
  data: Template | Template[]
}

export interface ExportContent {
  data: string
  width: number
  height: number
}

export interface ExportData {
  data: string
  width: number
  height: number
}

export interface ExportResult {
  code: number
  msg: string
  link: string
}

/**
 * 文件API类型声明
 */
export interface ImgData {
  id: number
  name: string
  dateTime: string
  imgPath: string
}

