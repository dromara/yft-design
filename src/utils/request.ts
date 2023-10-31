import axios, { AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { localStorage } from '@/utils/storage';

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 500000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    if (!config.headers) {
      throw new Error(
        `Expected 'config' and 'config.headers' not to be undefined`
      );
    }
    // const { user } = useStore();
    // if (user.token) {
    //   config.headers.Authorization = `${localStorage.get('token')}`;
    // }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg } = response.data;
    if (code === 200) {
      return response;
    } else {
      // 响应数据为二进制流处理(Excel导出)
      if (response.data instanceof ArrayBuffer) {
        return response;
      }
      if (response.data instanceof Array) {
        return response;
      }

      ElMessage({
        message: msg || '系统出错',
        type: 'error',
      });
      return Promise.reject(new Error(msg || 'Error'));
    }
  },
  (error: any) => {
    if (error.response.data) {
      const { detail } = error.response.data;
      console.log('code:', error.response.data)
      // token 过期,重新登录
      if (detail === 'Signature has expired.') {
        ElMessageBox.confirm('当前页面已失效，请重新登录', 'Warning', {
          confirmButtonText: 'OK',
          type: 'warning',
        }).then(() => {
          localStorage.clear();
          window.location.href = '/';
        });
      } else {
        ElMessage({
          message: detail || '系统出错',
          type: 'error',
        });
      }
    }
    return Promise.reject(error.message);
  }
);

// 导出 axios 实例
export default service;
