export interface ImageSize {
  width: number
  height: number
}

export interface UploadResult {
  code: number
  msg: string
  resultImage: string
  maskImage: string
  size: ImageSize
  time: string
}