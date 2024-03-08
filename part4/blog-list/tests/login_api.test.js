const assert = require('node:assert')
const { after, beforeEach, describe, test } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')

const api = supertest(require('../app'))

const baseRoute = '/api/login'

const initialData = [
  {
    _id: "5a422a851b54a676234d17f7",
    username: "test",
    name: "Testing",
    password: "$2b$10$O51H46LJc3JLDMZdPg/6ueDRm4eOk2f0d43UbjwqPeJrZNF9TZdwO",
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

describe(`POST ${baseRoute}`, () => {
  const { username } = initialData[0]
  const password = 'password'
  test('operation successful', async () => {
    await api
      .post(baseRoute)
      .send({ username, password })
      .expect(200)
  })
  test('invalid password', async () => {
    const response = await api
      .post(baseRoute)
      .send({ username, password: 'invalid' })
      .expect(401)
    assert(response.body.error.includes('InvalidCredentials'))
  })
  test('invalid username', async () => {
    const response = await api
      .post(baseRoute)
      .send({ username: 'invalid', password })
      .expect(401)
    assert(response.body.error.includes('InvalidCredentials'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
