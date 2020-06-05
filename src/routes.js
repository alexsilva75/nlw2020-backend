const express = require('express')
const multer = require('multer')
const multerConfig = require('./config/multer')
const { celebrate, Joi } = require('celebrate')


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

routes.post(
    '/points',
    upload.single('image'),

    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required()

        }),

    }, {
        abortEarly: false
    }),
    pointsController.create)

module.exports = { routes }