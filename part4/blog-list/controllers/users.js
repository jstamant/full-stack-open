const bcrypt = require('bcrypt')
require('express-async-errors')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (_request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

userRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body
  if (!password) {
    const error = new Error('Password is missing')
    error.name = 'ValidationError'
    return next(error)
  }
  if (password.length < 3) {
    const error = new Error('Password too short')
    error.name = 'ValidationError'
    return next(error)
  }
  const saltRounds = 10
  const hash = await bcrypt.hash(password, saltRounds)
  const user = new User({ username, name, password: hash })
  const saved = await user.save()
  response.status(201).json(saved)
})

module.exports = userRouter
