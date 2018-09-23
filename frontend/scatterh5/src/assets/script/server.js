import axios from "axios"
import http from './http'

const Axios = axios.create({
  baseURL: http.http.oraclechain,
  timeout: 10000,
  responseType: "json",
})
  
// POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    if (
      config.method === "post" ||
      config.method === "put" ||
      config.method === "delete"
    ) {
      // 序列化
      config.data = JSON.stringify(config.data)
    }
    return config
  },
  error => {
    return Promise.reject(error.data)
  }
)
  
// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    // 对响应数据做些事
    return Promise.resolve(res.data)
  },
  error => {
    return Promise.reject(error)
  }
)

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install: function(Vue, Option) {
    Object.defineProperty(Vue.prototype, "$axios", { value: Axios })
  }
}