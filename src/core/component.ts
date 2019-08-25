import { Component, ReactNode } from 'react'
import { $models } from '../models'
import { encodeQueryToUri } from '../utils/uri'

interface BaseP {
  history?: any
}

export type ExtendComponentProps<P> = Readonly<{ children?: ReactNode }> &
  Readonly<P> &
  Readonly<BaseP>

class ExtendComponent<P = any, S = any, SS = any> extends Component<P, S, SS> {
  public $models = $models
  public props: ExtendComponentProps<P>
  public unmount: boolean = false

  constructor (props: ExtendComponentProps<P>) {
    super(props)
    this.props = props
  }

  public componentWillUnmount () {
    this.unmount = true
  }

  public push (path: string, query?: any) {
    if (this.props.history) {
      this.props.history.push(path + encodeQueryToUri(query))
    }
  }
}

export default ExtendComponent
