import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { 
  OauthWechatResult, 
  ImageCaptchaResult, 
  EmailCaptchaResult,
  OauthVerifyData, 
  OauthGithubResult, 
  CodeParams, 
  EmailData,
  GithubCallbackResult 
} from './types'


export function imageCaptcha(): AxiosPromise<ImageCaptchaResult> {
  return request({
    url: '/api/oauth/captcha/image',
    method: 'get',
  })
}

export function emailCaptcha(data: EmailData): AxiosPromise<EmailCaptchaResult> {
  return request({
    url: '/api/oauth/captcha/email',
    method: 'post',
    data
  })
}

export function oauthVerify(data: OauthVerifyData): AxiosPromise<OauthWechatResult> {
  return request({
    url: '/api/oauth/verify',
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