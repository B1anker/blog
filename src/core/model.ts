import { AxiosInstance, AxiosRequestConfig } from 'axios'
import httpClient from './http'

export default class Model {
  public fetch: AxiosInstance

  constructor (config?: AxiosRequestConfig) {
    this.fetch = httpClient(config)
  }
}
