import { AxiosPromise } from 'axios'
import request from '@/utils/request'
import { PageParams, infoParams, TemplateResult, TemplateInfo } from "./types"


export const getTemplateInfoPages = (params: PageParams): AxiosPromise<TemplateResult> => {
  return request({
    url: '/api/design/template/info/pages',
    method: 'get',
    params,
  })
}

export const getTemplateDetailPages = (params: PageParams): AxiosPromise<TemplateResult> => {
  return request({
    url: '/api/design/template/detail/pages',
    method: 'get',
    params,
  })
}

export const getTemplateData = (pk: number): AxiosPromise<TemplateInfo> => {
  return request({
    url: `/api/design/template/data/${pk}`,
    method: 'get',
  })
}
