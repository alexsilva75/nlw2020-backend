const express = require('express')
const { routes } = require('./routes')
const path = require('path')
const cors = require('cors')
const { errors } = require('celebrate')

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))



//ANOTACOES DAS AULAS
// const users = ['Alexsandro','Diego','Cleiton', 'Robson']


// app.get('/users/:id', (req, resp)=> {
//     console.log('Accessing users route...')
//     const id = Number( req.params.id)
//     const user = users[id]
//     return resp.json(user)
// })

// app.get('/users', (req, resp)=> {
//     const search = String(req.query.search)
//     console.log('My Query: '+search)

//     const filteredUsers = search ? users.filter( user => user.includes(search) ) : users

//     return resp.json(filteredUsers)
// })


// app.get('/users', (req, resp)=> {
//     console.log('Accessing users route...')
//     resp.json(users)
// })

// app.post('/users', (req, resp) => {
//     const data = req.body
//     console.log(data)

//     const user = {
//         name: data.name,
//         email: data.email
//     }

//     return resp.json(user)
// })

app.use(errors())

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
    console.log(`Server working at ${PORT}`)
})