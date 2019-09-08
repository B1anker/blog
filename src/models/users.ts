import Model from '@/core/model'

class User extends Model {
  private modelName = '/user'

  public getInfo (id: number) {
    return this.http.get(`${this.modelName}/${id}`)
  }
}

export default new User()
