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

export interface CaptchaResult {
  image: string
  image_type: string
}

export interface ImageCaptchaResult {
  code: number
  data: CaptchaResult
  msg: string
}

export interface EmailResult {
  msg: string
}

export interface EmailCaptchaResult {
  code: number
  data: EmailResult
  msg: string
}

export interface OauthVerifyData {
  email: string
  password: string
  captcha: string
}

export interface OauthCheckData {
  email: string
  password: string
}


export interface RegisterResult {
  code: string
}

export interface OauthRegisterResult {
  code: number
  data: RegisterResult
  msg: string
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

export interface EmailData {
  email: string
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

export interface OauthUserResult {
  code: number
  data: UserResult
  msg: string
}