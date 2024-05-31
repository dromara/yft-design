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