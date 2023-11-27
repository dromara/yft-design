import request from '@/utils/request'
import { QueryParams, ImagePageResult } from './types'
import { AxiosPromise } from 'axios'

export function getPixabayImage(params?: QueryParams): AxiosPromise<ImagePageResult> {
  return request({
    url: 'api/pixabay/image',
    method: 'get',
    params,
  });
}