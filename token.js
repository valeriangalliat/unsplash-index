// Reject a token where 20% of its rate limit was used.
const defaultFilter = ({ limit, remaining }) =>
  limit === null || ((remaining / limit) > (20 / 100))

function TokenManager (ids, filter = defaultFilter) {
  const tokens = ids.map(id => ({ id, limit: null, remaining: null }))

  const index = tokens.reduce((index, token) => {
    index[token.id] = token
    return index
  }, {})

  // Pick a token based on its rate limit status.
  //
  // Will find all tokens that pass the given filter function and pick
  // a random one in the list.
  function getToken () {
    const token = tokens
      .filter(filter)
      .sort(() => 0.5 - Math.random())
      .shift()

    if (!token) throw new Error('No available token')

    return token.id
  }

  function wrapRequester (request) {
    return (...args) => {
      const token = getToken()

      const requester = request.defaults({
        headers: {
          Authorization: `Client-ID ${token}`
        }
      })

      return requester(...args)
        .then(res => {
          index[token].limit = res.headers['x-ratelimit-limit']
          index[token].remaining = res.headers['x-ratelimit-remaining']
          return res
        })
        .catch(err => {
          if (err.response.statusCode === 403) {
            index[token].limit = 1
            index[token].remaining = 0
          }

          throw err
        })
    }
  }

  return {
    getToken,
    wrapRequester
  }
}

module.exports = TokenManager
