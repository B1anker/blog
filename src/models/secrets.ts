import Model from '@/core/model'

export interface SecretModel {
  key: string
  desc: string
  id: string
  created: number
  updated: number
}

interface CreateSecretOptions {
  key: string
  value: string
  desc?: string
}

interface UpdateSecretOptions {
  key: string
  desc?: string
  value?: string
}

class Secrets extends Model {
  private modelName = '/secrets'

  public getSecrets () {
    return this.http.get<{ msg: string; list: SecretModel[] }>(
      `${this.modelName}`
    )
  }

  public createSecret (createSecretOptions: CreateSecretOptions) {
    return this.http.post(`${this.modelName}`, createSecretOptions)
  }

  public deleteSecret (key: string) {
    return this.http.delete(`${this.modelName}/${key}`)
  }

  public updateSecret ({ key, value, desc }: UpdateSecretOptions) {
    return this.http.put(`${this.modelName}/${key}`, {
      value,
      desc
    })
  }
}

export default new Secrets()
