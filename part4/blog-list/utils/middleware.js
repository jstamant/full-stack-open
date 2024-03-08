const tokenExtractor = (request, _response, next) => {
  const auth = request.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    request.token = auth.replace('Bearer ', '')
  }
  next()
}

module.exports = { tokenExtractor }
