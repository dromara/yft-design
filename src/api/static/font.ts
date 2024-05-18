import request from '@/utils/request'
import { QueryPgaes, FontPageResult } from './types'
import { AxiosPromise } from 'axios'

export const getImagePages = (params?: QueryPgaes): AxiosPromise<FontPageResult> => {
  return request({
    url: 'api/design/static/font',
    method: 'get',
    params,
  });
}