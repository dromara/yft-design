import request from '@/utils/request'
import { QueryFont, FontInfoResult } from './types'
import { AxiosPromise } from 'axios'

export const getFontInfo = (params?: QueryFont): AxiosPromise<FontInfoResult> => {
  return request({
    url: 'api/design/font/info',
    method: 'get',
    params,
  });
}