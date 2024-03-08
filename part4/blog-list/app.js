const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const blogRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const userRouter = require('./controllers/users')

const config = require('./utils/config')
const errorHandler = require('./utils/errorhandler')
const logger = require('./utils/logger')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error)
  })

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)

app.use(errorHandler)

module.exports = app
