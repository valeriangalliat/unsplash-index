const request = require('request-promise')

function Unsplash ({ applicationId, requester }) {
  requester = requester || Unsplash.makeRequester(applicationId)

  function getRandomPhotos (params) {
    return requester('/photos/random', { qs: params })
      .then(res => res.body)
  }

  return {
    getRandomPhotos
  }
}

Unsplash.makeRequester = applicationId =>
  request.defaults({
    baseUrl: 'https://api.unsplash.com/',
    headers: {
      Authorization: `Client-ID ${applicationId}`
    },
    json: true,
    resolveWithFullResponse: true
  })

module.exports = Unsplash
