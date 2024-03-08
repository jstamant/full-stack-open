const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialData = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  const commits = initialData
    .map((blog) => new Blog(blog))
    .map(async (blog) => await blog.save())
  await Promise.all(commits)
})

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('correct number of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 6)
  })
  test('_id fields are transformed to id', async () => {
    const response = await api.get('/api/blogs')
    response.body.map((blog) => assert('id' in blog))
  })
})

describe('POST /api/blogs', () => {
  const newBlog = {
    title: "Test Blog Post Title",
    author: "Foo Bar",
    url: "outgoing url"
  }
  test('operation successful', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
  })
  test('new post found in database', async () => {
    const { body } = await api
      .post('/api/blogs')
      .send(newBlog)
    assert(await Blog.findById(body.id).exec())
  })
  test('total number of blogs increased by one', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
    const response = await api
      .get('/api/blogs')
    assert.strictEqual(response.body.length, 7)
  })
  test('missing likes field will default to zero', async () => {
    const { body } = await api
      .post('/api/blogs')
      .send(newBlog)
    assert.strictEqual(body.likes, 0)
  })
  test('missing title results in 400 Bad Request', async () => {
    await api
      .post('/api/blogs')
      .send({ url: "title is missing" })
      .expect(400)
  })
  test('missing URL results in 400 Bad Request', async () => {
    await api
      .post('/api/blogs')
      .send({ title: "URL is missing" })
      .expect(400)
  })
})

describe('DELETE /api/blogs/:id', () => {
  const id = '5a422a851b54a676234d17f7'
  test('succeeds with code 204 No Content', async () => {
    await api
      .delete(`/api/blogs/${id}`)
      .expect(204)
  })
  test('removes one blog from the database', async () => {
    await api
      .delete(`/api/blogs/${id}`)
    const { body } = await api
      .get('/api/blogs')
    assert.strictEqual(body.length, 5)
  })
})

describe('PUT /api/blogs/:id', () => {
  const newBlog = {
    id: '5a422a851b54a676234d17f7',
    title: "Test Blog Post Title",
    author: "Foo Bar",
    url: "outgoing url",
    likes: 20
  }
  test('succeeds and responds with the updated blog', async () => {
    const { body } = await api
      .put(`/api/blogs/${newBlog.id}`)
      .send(newBlog)
      .expect(200)
    assert.deepStrictEqual(body, newBlog)
  })
})

after(async () => {
  await mongoose.connection.close()
})
