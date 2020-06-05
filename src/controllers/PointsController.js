const knex = require('../database/connection')

class PointsController {


    async index(request, response) {

        const { city, uf, items } = request.query

        console.log(`City: ${city}`)
        console.log(`UF: ${typeof (uf)}`)
        console.log(`Items: ${typeof (items)}`)

        let itemsArray = null
        if (city && uf && items) {
            if (typeof (items) === 'string') {
                itemsArray = items.split(',').map(item_id => item_id.trim())

            } else {
                itemsArray = items.map(item_id => item_id)
            }


            const points = await knex('points')
                .join('points_items', 'points.id', '=', 'points_items.point_id')
                .whereIn('points_items.item_id', itemsArray)
                .where('city', city)
                .where('uf', uf)
                .distinct()
                .select('points.*')

            const serializedPoints = points.map(point => {
                return {
                    ...point,
                    image_url: `http://192.168.0.103:3333/uploads/${point.image}`
                }
            }

            )

            return response.json(serializedPoints)
        } else {
            return response.json({ message: 'The search did not return any result.' })
        }
    }

    async create(request, response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body

        const trx = await knex.transaction()

        const point = {
            image: request.file.filename,//'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const insertedIds = await trx('points').insert(point)

        const point_id = insertedIds[0]

        let pointItems = null

        if (typeof (items) === 'string') {
            pointItems = items.split(',').map(item_id => ({ item_id: item_id.trim(), point_id }))
        } else {
            pointItems = items.map(item_id => ({ item_id, point_id }))
        }
        await trx('points_items').insert(pointItems)

        await trx.commit()

        return response.json({
            id: point_id,
            ...point
        }
        )
    }

    async show(request, response) {
        const id = request.params.id

        const point = await knex('points').where('id', id).first()

        if (!point) {
            return response.status(400).json({ message: 'Point not found.' })
        }

        const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id)
            .select('items.title')

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.0.103:3333/uploads/${point.image}`
        }

        console.log(point)
        return response.json({ point: serializedPoint, items })

    }
}

module.exports = PointsController