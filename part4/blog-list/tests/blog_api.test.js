const { after, beforeEach, describe, test } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const Blog = require('../models/blog')
const User = require('../models/user')

const app = require('../app')
const api = supertest(app)

const baseRoute = '/api/blogs'

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

const generateUserAndToken = async () => {
  const sampleUser = {
    username: 'test',
    password: 'password'
  }
  await api
    .post('/api/users')
    .send(sampleUser)
  const { token } = (await api
    .post('/api/login')
    .send(sampleUser))
    .body
  return token
}

beforeEach(async () => {
  await Blog.deleteMany({})
  const commits = initialData
    .map((blog) => new Blog(blog))
    .map(async (blog) => await blog.save())
  await Promise.all(commits)
})

describe(`GET ${baseRoute}`, () => {
  test('blogs are returned as json', async () => {
    await api
      .get(baseRoute)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('correct number of blogs', async () => {
    const response = await api.get(baseRoute)
    assert.strictEqual(response.body.length, 6)
  })
  test('_id fields are transformed to id', async () => {
    const response = await api.get(baseRoute)
    response.body.map((blog) => assert('id' in blog))
  })
})

describe(`POST ${baseRoute}`, async () => {
  const sampleBlog = {
    title: "Test Blog Post Title",
    author: "Foo Bar",
    url: "none"
  }
  const token = await generateUserAndToken()
  const auth = `Bearer ${token}`

  test('operation successful', async () => {
    await api
      .post(baseRoute)
      .send(sampleBlog)
      .set('Authorization', auth)
      .expect(201)
  })
  test('new post found in database', async () => {
    const { body } = await api
      .post(baseRoute)
      .send(sampleBlog)
      .set('Authorization', auth)
    assert(await Blog.findById(body.id).exec())
  })
  test('total number of blogs increased by one', async () => {
    await api
      .post(baseRoute)
      .send(sampleBlog)
      .set('Authorization', auth)
    const response = await api
      .get(baseRoute)
    assert.strictEqual(response.body.length, 7)
  })
  test('missing likes field will default to zero', async () => {
    const { body } = await api
      .post(baseRoute)
      .send(sampleBlog)
      .set('Authorization', auth)
    assert.strictEqual(body.likes, 0)
  })
  test('missing title results in 400 Bad Request', async () => {
    await api
      .post(baseRoute)
      .send({ url: "title is missing" })
      .set('Authorization', auth)
      .expect(400)
  })
  test('missing URL results in 400 Bad Request', async () => {
    await api
      .post(baseRoute)
      .send({ title: "URL is missing" })
      .set('Authorization', auth)
      .expect(400)
  })
})

describe(`DELETE ${baseRoute}/:id`, () => {
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
      .get(baseRoute)
    assert.strictEqual(body.length, 5)
  })
})

describe(`PUT ${baseRoute}/:id`, async () => {
  const token = await generateUserAndToken()
  const auth = `Bearer ${token}`

  const newBlog = {
    id: '5a422a851b54a676234d17f7',
    title: "Test Blog Post Title",
    author: "Foo Bar",
    url: "outgoing url",
    likes: 20
  }
  test('succeeds and responds with the updated blog', async () => {
    const { body } = await api
      .put(`${baseRoute}/${newBlog.id}`)
      .send(newBlog)
      .set('Authorization', auth)
      .expect(200)
    assert.deepStrictEqual(body, newBlog)
  })
})

after(async () => {
  await mongoose.connection.close()
})
