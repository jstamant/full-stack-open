require('express-async-errors')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response, next) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)

  if (!user || !passwordCorrect) {
    const error = new Error('Invalid username or password')
    error.name = 'InvalidCredentials'
    return next(error)
  }

  const payload = { username: user.username, id: user._id }
  const token = jwt.sign(payload, process.env.SECRET)

  response
    .status(200)
    .json({ username: user.username, token })
})

module.exports = loginRouter
