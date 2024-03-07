const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

const saltRounds = 10

userRouter.get('/', async (_request, response) => {
  const users = await User.find({})
  response.json(users)
})

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  const hash = await bcrypt.hash(password, saltRounds)
  const user = new User({ username, name, password: hash })
  const saved = await user.save()
  response.status(201).json(saved)
})

module.exports = userRouter
