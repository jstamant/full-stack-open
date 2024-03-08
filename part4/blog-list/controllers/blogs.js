require('express-async-errors')

const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    const error = new Error('Token invalid')
    error.name = 'InvalidCredentials'
    return next(error)
  }

  if (!request.body.likes)
    request.body.likes = 0
  if (!request.body.title || !request.body.url)
    return response.status(400).end()
  const blog = new Blog(request.body)
  const user = await User.findById(decodedToken.id)
  blog.user = user
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { body } = request
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true})
  response.status(200).json(updatedBlog)
})

module.exports = blogRouter
