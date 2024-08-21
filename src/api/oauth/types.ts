export interface YFTUser {
  id: number
  uuid: string
  username: string
  nickname: string
  phone?: string
  avatar?: string
  dept_id?: number
  email: string
  is_multi_login: boolean
  is_staff: boolean
  is_superuser: boolean
  join_time: string
  last_login_time: string
}

export interface CaptchaReult {
  image: string
  image_type: string
}

export interface OauthCaptchaResult {
  code: number
  data: CaptchaReult
  msg: string
}

export interface OauthLoginData {
  email: string
  password: string
  captcha: string
}

export interface OauthWechatData {
  img: string
}

export interface OauthWechatResult {
  code: number
  data: OauthWechatData
  msg: string
}

export interface OauthGithubResult {
  code: number
  data: string
  msg: string
}

export interface CodeParams {
  code: string
}

export interface UserResult {
  access_token: string
  access_token_expire_time: string
  access_token_type: string
  refresh_token: string
  refresh_token_expire_time: string
  refresh_token_type: string
  user: YFTUser
}

export interface GithubCallbackResult {
  code: number
  data: UserResult
  msg: string
}