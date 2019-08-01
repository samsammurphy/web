if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')

const app = express()

// Connect to Mongo
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// BodyParser (to get data from a form with req.body)
app.use(express.urlencoded({extended:false}))

//Routers
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))



const port = process.env.PORT || 3000

app.listen(port, console.log('Listening on port', port))