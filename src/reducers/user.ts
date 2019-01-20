const user = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER_INFO':
      return {
        ...state,
        ...action.user
      }
    default:
      return state
  }
}

export default user
