require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const Youch = require('youch')
const Sentry = require('@sentry/node')
const validate = require('express-validation')
const databaseConfig = require('./config/database')
const sentryConfig = require('./config/sentry')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.database()
    this.middlewares()
    this.sentry()
    this.routes()
    this.exception()
  }

  sentry () {
    Sentry.init(sentryConfig)
  }

  database () {
    mongoose.connect(databaseConfig.uriP, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }

  middlewares () {
    this.express.use(express.json())
    this.express.use(Sentry.Handlers.requestHandler())
  }

  routes () {
    this.express.use(require('./routes'))
  }

  exception () {
    if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler())
    }

    // middleware para lidar com a parte de exceções
    this.express.use(async (err, req, res, next) => {
      if (err instanceof validate.ValidationError) {
        // deixando a msg mais bonita para erros de validação
        return res.status(err.status).json(err)
      }

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err, req)
        return res.json(await youch.toJSON())
      }

      return res
        .status(err.status || 500)
        .json({ error: 'Internal Server Erro' })
    })
  }
}

module.exports = new App().express
