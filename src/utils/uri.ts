export const encodeQueryToUri = (query) => {
  if (!query) {
    return ''
  }
  return Object.keys(query)
    .reduce((uri, next) => {
      return (uri += `${next}=${query[next]}&`)
    }, '?')
    .slice(0, -1)
}

export const decodeUriToQuery = (uri: string) => {
  let start = uri.indexOf('?')
  start = !~start ? 0 : start + 1
  const query: any = {}
  const queryUri = uri.slice(start)
  queryUri.split('&').forEach((group) => {
    const [key, val] = group.split('=')
    query[key] = val
  })
  return query
}
