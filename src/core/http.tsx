import { message, notification } from 'antd'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import React from 'react'
import ReactJson from 'react-json-view'

import config from '@/core/config'

const openErrorNotification = (msg) => {
  notification.error({
    message: '服务器出错',
    description: <ReactJson src={msg}
      iconStyle="square"
      collapseStringsAfterLength={30} />
  })
}

export default (cfg: AxiosRequestConfig = { baseURL: config.baseUrl }) => {
  const instance: AxiosInstance = axios.create({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    ...cfg
  })

  instance.interceptors.request.use((config) => {
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  instance.interceptors.response.use((response: AxiosResponse) => {
    const { status, data } = response
    if (status === 200) {
      if (data.code === 500) {
        openErrorNotification(data.msg)
      }
    }
    return response
  }, (error) => {
    let err
    if (error.response) {
      const status: number = error.response.status
      if (status === 412) {
        message.success('您未登录，正在跳转登录页...')
        setTimeout(() => {
          window.location.href = '/'
        }, 600)
      }
      if (status >= 500) {
        openErrorNotification({
          status,
          msg: error.response.data.message || error.response.data
        })
      }
      err = new Error(error.response.data.msg)
    }
    return Promise.reject(err)
  })
  return instance
}
