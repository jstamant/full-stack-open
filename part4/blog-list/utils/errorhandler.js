const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: `${error.name}: ${error.message}` })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(500).send({ error: `${error.name}: expected 'username' to be unique` })
  } else if (error.name === 'InvalidCredentials') {
    return response.status(401).send({ error: `${error.name}: ${error.message}` })
  }

  next(error)
}

module.exports = errorHandler
