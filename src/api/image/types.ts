export interface QueryParams {
  q: string
  page: number
}

export enum PixabayImageType {
  photo,
  illustration,
  vector,
}

export interface PixabayImageDetail {
  id: number
  pageURL: string
  type: PixabayImageType
  tags: string
  previewURL: string
  previewWidth: number
  previewHeight: number
  webformatURL: string
  webformatWidth: number
  webformatHeight: number
  largeImageURL: string
  imageWidth: number
  imageHeight: number
  imageSize: number
  views: number
  downloads: number
  collections: number
  likes: number
  comments: number
  user_id: number
  user: string
  userImageURL: string
}

export interface PixabayImageResult {
  total: number
  totalHits: number
  hits: PixabayImageDetail[]
}

export interface ImagePageResult {
  code: number
  msg: number
  data: PixabayImageResult
}