import { Component } from 'react'

import archives from './archives'
import auth from './auth'
import category from './category'
import posts from './posts'
import secrets from './secrets'
import upload from './upload'
import users from './users'

export const $models = {
  posts,
  users,
  auth,
  category,
  archives,
  upload,
  secrets
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
