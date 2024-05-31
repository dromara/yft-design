import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { OauthWechatResult, OauthGithubResult } from './types'


export function oauthWechat(): AxiosPromise<OauthWechatResult> {
  return request({
    url: '/api/design/oauth/wechat',
    method: 'post',
  })
}

export function oauthGithubToken(): AxiosPromise<OauthGithubResult> {
  return request({
    url: '/api/oauth/github/token',
    method: 'get',
  })
}