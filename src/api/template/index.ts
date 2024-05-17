import { AxiosPromise } from 'axios'
import request from '@/utils/request'
import { PageParams, TemplateResult } from "./types"


export const getTemplatePages = (params: PageParams): AxiosPromise<TemplateResult> => {
  return request({
    url: '/api/template/pages',
    method: 'get',
    params,
  })
}
