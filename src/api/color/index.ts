import request from '@/utils/request';
import { AxiosPromise } from 'axios';
export function getColorShading(): any {
  return request({
    url: '/lib/color/shading.json',
    method: 'get',
  });
}