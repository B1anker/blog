const system = (state = {
  scrolled: false
},              action) => {
  switch (action.type) {
    case 'CHANGE_SCROLL_STATUS':
      return {
        ...state,
        scrolled: action.scrolled
      }
    default:
      return state
  }
}

export default system
