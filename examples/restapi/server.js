// read environment variables from .env file
require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

// connect to a local db called 'subscribers'
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

// allow server to except json as a body
app.use(express.json())

// routes
const subscribersRouter = require('./routes/subscribers')
app.use('/subscribers', subscribersRouter)

app.listen(3000, () => console.log('server started'))