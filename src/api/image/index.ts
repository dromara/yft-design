import request from '@/utils/request'
import { QueryParams, ImagePageResult, ImageCategoryResult } from './types'
import { AxiosPromise } from 'axios'

export function getImagePages(params?: QueryParams): AxiosPromise<ImagePageResult> {
  return request({
    url: 'api/image/page',
    method: 'get',
    params,
  });
}

export function getImageCategory(): AxiosPromise<ImageCategoryResult> {
  return request({
    url: 'api/image/category',
    method: 'get',
  });
}