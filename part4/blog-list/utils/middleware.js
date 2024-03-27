const jwt = require('jsonwebtoken')

const tokenExtractor = (request, _response, next) => {
  const auth = request.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    request.token = auth.replace('Bearer ', '')
  }
  next()
}

const userExtractor = (request, _response, next) => {
  if (request.token) {
    request.user = jwt.verify(request.token, process.env.SECRET)
    if (!request.user.id || !request.user.username) {
      const error = new Error('Token invalid')
      error.name = 'InvalidCredentials'
      next(error)
    }
  } else {
    const error = new Error('Missing authorization token')
    error.name = 'InvalidCredentials'
    next(error)
  }
  next()
}

module.exports = {
  tokenExtractor,
  userExtractor
}
