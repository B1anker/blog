import Model from '@/core/model'

class Upload extends Model {
  private modelName = '/upload'

  public getQiniuToken<T> () {
    return this.http.get<T>(`${this.modelName}/qiniuToken`)
  }
}

export default new Upload()
