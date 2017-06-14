const parse = require('parse-link-header')

exports.parse = res => {
  const link = parse(res.headers.link)

  Object.keys(link).forEach(key => {
    res[`${key}Page`] = link[key].url
  })

  return res
}

exports.iterate = (requester, cb) => {
  const iterate = (...args) => {
    const req = requester(...args).then(exports.parse)

    return cb(req)
      .then(() => req)
      .then(res => res.nextPage && iterate(res.nextPage, { baseUrl: null }))
  }

  iterate.resume = nextPage =>
    iterate(nextPage, { baseUrl: null })

  return iterate
}
