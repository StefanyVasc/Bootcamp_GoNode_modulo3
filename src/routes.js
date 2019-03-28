const express = require('express')
const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')

const controllers = require('./app/controllers')

// rota para a criação do usuário

routes.post('/users', controllers.UserController.store)
routes.post('/sessions', controllers.SessionController.store)

routes.use(authMiddleware)
// todas as rotas que estiverem abaixo desse routes.use estão configuradas para APENAS  usuários autenticados

/*
rotas para acessar os metodos do AdController
*/

routes.get('/ads', controllers.AdController.index)
routes.get('/ads/:id', controllers.AdController.show)
routes.post('/ads', controllers.AdController.store)
routes.put('/ads/:id', controllers.AdController.update) // metodo put é indicado para atualizações
routes.delete('/ads/:id', controllers.AdController.destroy)

/* Purchases */

routes.post('/purchases', controllers.PurchaseController.store)

module.exports = routes
