const knex = require('../database/connection')

class PointsController {

    async index(request, response){

        const {city, uf, items} = request.query

        const itemsArray = items.split(',').map( item_id => item_id.trim())

        const points = await knex('points')
            .join('points_items', 'points.id', '=', 'points_items.point_id')
            .whereIn('points_items.item_id', itemsArray)
            .where('city', city)
            .where('uf', uf)
            .distinct()
            .select('points.*')
        return response.json(points)
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
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
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

        const pointItems = items.map(item_id => ({ item_id, point_id }))

        await trx('points_items').insert(pointItems)

        await trx.commit()

        return response.json({
            id: point_id,
            ...point
        }
        )
    }

    async show(request, response){
        const id = request.params.id

        const point = await knex('points').where('id', id).first()

        if(!point){
            return response.status(400).json({message: 'Point not found.'})
        }

        const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where( 'points_items.point_id', id)
            .select('items.title')


        console.log(point)
        return response.json({point, items})

    }
}

module.exports = PointsController