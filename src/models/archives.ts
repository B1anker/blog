import Model from '@/core/model'

export interface ArchiveModel {
  title: string
  created: number
  id: string
}

class Archives extends Model {
  private modelName = '/archives'

  public getTimeline () {
    return this.http.get<{ msg: string; archives: ArchiveModel[] }>(`${this.modelName}/timeline`)
  }
}

export default new Archives()
