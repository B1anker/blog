import { AxiosInstance, AxiosRequestConfig } from 'axios';

import httpClient from './http';

export default class Model {
  public http: AxiosInstance

  constructor (config?: AxiosRequestConfig) {
    this.http = httpClient(config)
  }
}
