const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  if (!request.body.likes)
    request.body.likes = 0
  if (!request.body.title || !request.body.url)
    return response.status(400).end()
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { body } = request
  const updatedPost = await Blog.findByIdAndUpdate(request.params.id, body, { new: true})
  response.status(200).json(updatedPost)
})

module.exports = blogRouter
