import { AxiosPromise } from 'axios'
import request from '@/utils/request'
import { PageParams, infoParams, TemplateResult, TemplateInfo } from "./types"


export const getTemplatePages = (params: PageParams): AxiosPromise<TemplateResult> => {
  return request({
    url: '/api/design/template/pages',
    method: 'get',
    params,
  })
}

export const getTemplateInfo = (pk: number): AxiosPromise<TemplateInfo> => {
  return request({
    url: `/api/design/template/info/${pk}`,
    method: 'get',
  })
}
