import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { UploadResult, ExportData, ExportResult } from './types'

/**
 * 上传文件
 *
 * @param file
 */
export function uploadFile(file: File, type: string): AxiosPromise<UploadResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)
  return request({
    url: '/api/upload/file',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 导出文件
 *
 * @param file
 */
export function exportFile(data: ExportData): AxiosPromise<ExportResult> {

  return request({
    url: '/api/export/file',
    method: 'post',
    data,
  })
}
