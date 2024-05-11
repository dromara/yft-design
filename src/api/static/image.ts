import request from '@/utils/request'
import { QueryPgaes, QueryCategory, ImagePageResult, ImageCategoryResult } from './types'
import { AxiosPromise } from 'axios'

export function getImagePages(params?: QueryPgaes): AxiosPromise<ImagePageResult> {
  return request({
    url: 'api/image/page',
    method: 'get',
    params,
  });
}

export function getImageCategory(params?: QueryCategory): AxiosPromise<ImageCategoryResult> {
  return request({
    url: 'api/image/category',
    method: 'get',
    params
  });
}

export function getIllustrationPages(params?: QueryPgaes): AxiosPromise<ImagePageResult> {
  return request({
    url: 'api/illustration/page',
    method: 'get',
    params,
  });
}

export function getIllustrationCategory(params?: QueryCategory): AxiosPromise<ImageCategoryResult> {
  return request({
    url: 'api/illustration/category',
    method: 'get',
    params
  });
}