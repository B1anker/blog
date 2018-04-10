import { Component } from 'react'
import user from './user'
import post from './post'

const $models = {
  post,
  user
}

export default () => {
  Object.defineProperty(Component.prototype, '$models', {
    get () {
      return $models
    }
  })
}