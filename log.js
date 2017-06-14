function wrapRequester (request, logger) {
  return (...args) =>
    request(...args)
      .catch(err => {
        logger(err.response)
        throw err
      })
      .then(res => {
        logger(res)
        return res
      })
}

exports.wrapRequester = wrapRequester
