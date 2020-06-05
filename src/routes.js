const express = require('express')
const multer = require('multer')
const multerConfig = require('./config/multer')


const routes = express.Router()
const upload = multer(multerConfig)

const PointsController = require('./controllers/PointsController')
const pointsController = new PointsController()

const ItemsController = require('./controllers/ItemsController')
const itemsController = new ItemsController()

routes.get('/items', itemsController.index)

routes.get('/points', pointsController.index)
//routes.get('/points', pointsController.index)
routes.get('/points/:id', pointsController.show)

routes.post('/points',upload.single('image'), pointsController.create)

module.exports = { routes }