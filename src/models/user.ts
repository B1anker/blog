import Model from '@/core/model'

class User extends Model {
  modelName = '/admin'

  getInfo () {
    return this.fetch.get(`${this.modelName}/info`)
  }

  login (data) {
    return this.fetch.post(`${this.modelName}/login`, data)
  }
}

export default new User()