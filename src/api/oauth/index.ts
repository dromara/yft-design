import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { OauthWechatResult, OauthGithubResult, CodeParams, githubCallbackResult } from './types'


export function oauthWechat(): AxiosPromise<OauthWechatResult> {
  return request({
    url: '/api/oauth/token/wechat',
    method: 'post',
  })
}

export function oauthTokenGithub(): AxiosPromise<OauthGithubResult> {
  return request({
    url: '/api/oauth/token/github',
    method: 'get',
  })
}

export function oauthCallbackGithub(params: CodeParams): AxiosPromise<githubCallbackResult> {
  return request({
    url: '/api/oauth/callback/github',
    method: 'get',
    params,
  })
}