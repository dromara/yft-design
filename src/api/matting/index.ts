import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { UploadResult } from './types'


/**
 * 上传文件
 *
 * @param file
 */
 export function uploadImage(image: File, type: string): AxiosPromise<UploadResult> {
  const formData = new FormData()
  formData.append('image', image)
  formData.append('type', type)
  return request({
    url: '/api/matting/file',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}