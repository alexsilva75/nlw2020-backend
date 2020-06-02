const express = require('express')

const routes = express.Router()

const PointsController = require('./controllers/PointsController')
const pointsController = new PointsController()

const ItemsController = require('./controllers/ItemsController')
const itemsController = new ItemsController()

routes.get('/items', itemsController.index)

routes.get('/points/:id', pointsController.show)
routes.get('/points', pointsController.index)
routes.post('/points', pointsController.create)

module.exports = { routes }