import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { UploadResult } from './types'


/**
 * 上传文件
 *
 * @param image
 */
 export function uploadImage(image: File, type?: string): AxiosPromise<UploadResult> {
  const formData = new FormData()
  formData.append('image', image)
  return request({
    url: '/api/matting/file',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}