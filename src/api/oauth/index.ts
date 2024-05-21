import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { OauthWechatResult } from './types'


export function oauthWechat(): AxiosPromise<OauthWechatResult> {
  return request({
    url: '/api/design/oauth/wechat',
    method: 'post',
  })
}