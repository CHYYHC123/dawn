import axios, { type AxiosRequestHeaders } from 'axios';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * 封装 axios，返回一个请求函数
 * @param url 请求地址
 * @param method 请求方法，默认 GET
 * @param data 请求体（POST/PUT/PATCH）
 * @param headers 请求头
 * @returns 响应数据（res.data）
 */
export function createHttp() {
  return function request<T = unknown>(
    url: string,
    method: HttpMethod = 'GET',
    data?: unknown,
    headers?: AxiosRequestHeaders
  ): Promise<T> {
    return axios({
      url,
      method,
      data,
      headers
    }).then(res => res.data as T);
  };
}

export const request = createHttp();
