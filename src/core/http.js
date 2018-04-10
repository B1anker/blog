import { message } from 'antd'
import axios from 'axios'
import config from './config'

const instance = axios.create({
  baseURL: config.baseUrl,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

instance.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

instance.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  if (error.response) {
    if (error.response.status === 412 && window.location.pathname.includes('/admin')) {
      message.success('您未登录，正在跳转登录页...')
      setTimeout(() => {
        window.location.href = '/login'
      }, 600)
    }
  }
  return Promise.reject(error)
})

export default instance
