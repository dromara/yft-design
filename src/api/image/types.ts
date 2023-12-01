export interface QueryPgaes {
  t: string
  page: number
}

export interface QueryCategory {
  t: string
}

export enum ImageType {
  photo,
  illustration,
  vector,
}

export interface ImageHit {
  id: number
  pageURL: string
  type: ImageType
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

export interface ImagePage {
  total: number
  totalHits: number
  hits: ImageHit[]
}

export interface ImagePageResult {
  code: number
  msg: string
  data: ImageHit[]
}

export interface ImageCategoryResult {
  code: number
  msg: string
  data: ImageHit[]
}