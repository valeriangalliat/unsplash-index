const request = require('request-promise')

exports.wrapRequester = (requester, applicationId) =>
  request.defaults({
    baseUrl: 'https://api.unsplash.com/',
    headers: {
      Authorization: `Client-ID ${applicationId}`
    },
    json: true,
    resolveWithFullResponse: true
  })

exports.makeRequester = applicationId =>
  exports.wrapRequester(request, applicationId)
