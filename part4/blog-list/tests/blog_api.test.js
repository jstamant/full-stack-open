const { after, beforeEach, describe, test } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const Blog = require('../models/blog')
const User = require('../models/user')

const app = require('../app')
const api = supertest(app)

const baseRoute = '/api/blogs'
const testCredentials = { username: 'username', password: 'password' }

const initialData = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }
]

const getAuth = async (credentials) => {
  const loginResponse = await api
    .post('/api/login')
    .send(credentials)
  return `Bearer ${loginResponse.body.token}`
}

beforeEach(async () => {
  await User.deleteMany({})
  await api
    .post('/api/users')
    .send(testCredentials)

  await Blog.deleteMany({})
  const auth = await getAuth(testCredentials)
  const commits = initialData
    .map((blog) => {
      return api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', auth)
    })

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

  test('operation successful', async () => {
    await api
      .post(baseRoute)
      .send(sampleBlog)
      .set('Authorization', await getAuth(testCredentials))
      .expect(201)
  })
  test('new post found in database', async () => {
    const { body } = await api
      .post(baseRoute)
      .send(sampleBlog)
      .set('Authorization', await getAuth(testCredentials))
    assert(await Blog.findById(body.id).exec())
  })
  test('total number of blogs increased by one', async () => {
    await api
      .post(baseRoute)
      .send(sampleBlog)
      .set('Authorization', await getAuth(testCredentials))
    const response = await api
      .get(baseRoute)
    assert.strictEqual(response.body.length, 7)
  })
  test('missing likes field will default to zero', async () => {
    const { body } = await api
      .post(baseRoute)
      .send(sampleBlog)
      .set('Authorization', await getAuth(testCredentials))
    assert.strictEqual(body.likes, 0)
  })
  test('missing title results in 400 Bad Request', async () => {
    await api
      .post(baseRoute)
      .send({ url: "title is missing" })
      .set('Authorization', await getAuth(testCredentials))
      .expect(400)
  })
  test('missing URL results in 400 Bad Request', async () => {
    await api
      .post(baseRoute)
      .send({ title: "URL is missing" })
      .set('Authorization', await getAuth(testCredentials))
      .expect(400)
  })
  test('missing token results in 401 Unauthorized', async () => {
    await api
      .post(baseRoute)
      .send(sampleBlog)
      .expect(401)
  })
})

describe(`DELETE ${baseRoute}/:id`, async () => {
  test('succeeds with code 204 No Content', async () => {
    const blog = await Blog.findOne()
    await api
      .delete(`${baseRoute}/${blog.id}`)
      .set('Authorization', await getAuth(testCredentials))
      .expect(204)
  })
  test('removes one blog from the database', async () => {
    const blog = await Blog.findOne()
    await api
      .delete(`${baseRoute}/${blog.id}`)
      .set('Authorization', await getAuth(testCredentials))
    const { body } = await api
      .get(baseRoute)
    assert.strictEqual(body.length, 5)
  })
})

describe(`PUT ${baseRoute}/:id`, async () => {
  test('succeeds and responds with the updated blog', async () => {
    const blog = await Blog.findOne()
    blog.title = "Test Blog Post Title"
    blog.author = "Foo Bar"
    blog.url = "outgoing url"
    blog.likes = 20
    const { body } = await api
      .put(`${baseRoute}/${blog.id}`)
      .send(blog)
      .set('Authorization', await getAuth(testCredentials))
      .expect(200)
    assert.strictEqual(body.title, blog.title)
    assert.strictEqual(body.author, blog.author)
    assert.strictEqual(body.url, blog.url)
    assert.strictEqual(body.likes, blog.likes)
  })
})

after(async () => {
  await mongoose.connection.close()
})
