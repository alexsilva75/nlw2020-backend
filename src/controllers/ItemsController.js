const knex = require('../database/connection')

class ItemsController {
    async index(request, response){
        const items = await knex('items').select('*')
    
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `https://nlw2020-backend.herokuapp.com/uploads/${item.image}`
            }
        }
        )
    
        return response.json(serializedItems)
    }
}

module.exports = ItemsController