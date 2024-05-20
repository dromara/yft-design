import request from '@/utils/request'
import { QueryPgaes, FontPageResult } from './types'
import { AxiosPromise } from 'axios'

export const getFontInfo = (params?: QueryPgaes): AxiosPromise<FontPageResult> => {
  return request({
    url: 'api/design/font/info',
    method: 'get',
    params,
  });
}