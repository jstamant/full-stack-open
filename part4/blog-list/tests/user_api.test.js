const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const baseRoute = '/api/users'
const initialData = [
  {
    _id: "5a422a851b54a676234d17f7",
    username: "username0",
    name: "First0 Last0",
    password: "$2b$10$jG8RBR7eBlhm5XugxP3oVegkJIgFjYRXxpUZWtpRgBPnFug1c3ZoG",
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    username: "username1",
    name: "First1 Last1",
    password: "$2b$10$jG8RBR7eBlhm5XugxP3oVegkJIgFjYRXxpUZWtpRgBPnFug1c3ZoG",
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    username: "username2",
    name: "First2 Last2",
    password: "$2b$10$jG8RBR7eBlhm5XugxP3oVegkJIgFjYRXxpUZWtpRgBPnFug1c3ZoG",
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    username: "username3",
    name: "First3 Last3",
    password: "$2b$10$jG8RBR7eBlhm5XugxP3oVegkJIgFjYRXxpUZWtpRgBPnFug1c3ZoG",
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    username: "username4",
    name: "First4 Last4",
    password: "$2b$10$jG8RBR7eBlhm5XugxP3oVegkJIgFjYRXxpUZWtpRgBPnFug1c3ZoG",
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    username: "username5",
    name: "First5 Last5",
    password: "$2b$10$jG8RBR7eBlhm5XugxP3oVegkJIgFjYRXxpUZWtpRgBPnFug1c3ZoG",
    __v: 0
  }
]

beforeEach(async () => {
  await User.deleteMany({})
  const commits = initialData
    .map((user) => new User(user))
    .map(async (user) => await user.save())
  await Promise.all(commits)
})

describe(`GET ${baseRoute}`, () => {
  test('users are returned as json', async () => {
    await api
      .get(baseRoute)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('correct number of users', async () => {
    const response = await api.get(baseRoute)
    assert.strictEqual(response.body.length, 6)
  })
  test('_id fields are transformed to id', async () => {
    const response = await api.get(baseRoute)
    response.body.map((post) => assert('id' in post))
  })
})

describe(`POST ${baseRoute}`, () => {
  const newUser = {
    username: "foobar",
    name: "Foo Bar",
    password: "password"
  }
  test('operation successful', async () => {
    await api
      .post(baseRoute)
      .send(newUser)
      .expect(201)
  })
  test('new user found in database', async () => {
    const { body } = await api
      .post(baseRoute)
      .send(newUser)
    assert(await User.findById(body.id).exec())
  })
  test('total number of users increased by one', async () => {
    await api
      .post(baseRoute)
      .send(newUser)
    const response = await api
      .get(baseRoute)
    assert.strictEqual(response.body.length, 7)
  })
  test('username minimum length', async () => {
    const response = await api
      .post(baseRoute)
      .send({ ...newUser , username: 'no'})
      .expect(400)
    assert(response.body.error.includes('ValidationError'))
  })
  test('username not missing', async () => {
    const response = await api
      .post(baseRoute)
      .send({ name: newUser.name, password: newUser.password })
      .expect(400)
    assert(response.body.error.includes('ValidationError'))
  })
  test('non-unique username', async () => {
    const response = await api
      .post(baseRoute)
      .send({ ...newUser, username: 'username0' })
      .expect(500)
    assert(response.body.error.includes('MongoServerError'))
  })
  test('password minimum length', async () => {
    const response = await api
      .post(baseRoute)
      .send({ ...newUser , password: 'no'})
      .expect(400)
    assert(response.body.error.includes('Password too short'))
  })
  test('password not missing', async () => {
    const response = await api
      .post(baseRoute)
      .send({ username: newUser.username, name: newUser.name })
      .expect(400)
    assert(response.body.error.includes('Password is missing'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
