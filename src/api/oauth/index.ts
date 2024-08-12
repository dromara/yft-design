import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { OauthWechatResult, OauthCaptchaResult, OauthLoginData, OauthGithubResult, CodeParams, GithubCallbackResult } from './types'


export function oauthCaptcha(): AxiosPromise<OauthCaptchaResult> {
  return request({
    url: '/api/oauth/captcha',
    method: 'get',
  })
}

export function oauthLogin(data: OauthLoginData): AxiosPromise<OauthWechatResult> {
  return request({
    url: '/api/oauth/login',
    method: 'post',
    data
  })
}

export function oauthWechat(): AxiosPromise<OauthWechatResult> {
  return request({
    url: '/api/oauth/token/wechat',
    method: 'post',
  })
}

export function oauthTokenGithub(): AxiosPromise<OauthGithubResult> {
  return request({
    url: '/api/oauth/github/token',
    method: 'get',
  })
}

export function oauthCallbackGithub(params: CodeParams): AxiosPromise<GithubCallbackResult> {
  return request({
    url: '/api/oauth/github/callback',
    method: 'get',
    params,
  })
}