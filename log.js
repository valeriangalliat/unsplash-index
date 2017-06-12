function wrapRequester (request, logger) {
  return (...args) =>
    request(...args)
      .then(res => {
        logger(res)
        return res
      })
}

exports.wrapRequester = wrapRequester
