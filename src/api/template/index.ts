import { AxiosPromise } from 'axios'
import request from '@/utils/request'
import { PageParams, PageResult } from "./types"


export const getTemplatePages = (params: PageParams): AxiosPromise<PageResult> => {
  return request({
    url: '/api/template/pages',
    method: 'get',
    params,
  })
}
