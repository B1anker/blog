import { Component } from 'react'

import archives from './archives'
import auth from './auth'
import category from './category'
import post from './post'
import upload from './upload'
import user from './user'

export const $models = {
  post,
  user,
  auth,
  category,
  archives,
  upload
}

export default () => {
  Object.defineProperty(Component.prototype, '$models', {
    get () {
      return $models
    },

    set (newVal) {
      return newVal
    }
  })
}
