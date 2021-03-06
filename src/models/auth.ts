import Model from '@/core/model'

interface LoginModel {
  account: string
  password: string
}

interface User {
  account: string
  roles: string[]
}

export class UserModel extends Model {
  private modelName = '/auth'

  public getPublicKey () {
    return this.http.post<{ data: string }>(`${this.modelName}/public`)
  }

  public login (data: LoginModel) {
    return this.http.post<{ data: User }>(`${this.modelName}/login`, data)
  }

  public logout () {
    return this.http.post(`${this.modelName}/logout`)
  }

  public check () {
    return this.http.post(`${this.modelName}/check`)
  }
}

export default new UserModel()
