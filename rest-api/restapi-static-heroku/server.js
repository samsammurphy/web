if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')

// connect to a local db called 'users'
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

// allow server to except json as a body
app.use(express.json())

// use static files in build
app.use(express.static('build'))

// routes
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

const port = process.env.PORT || 3000 
app.listen(port, () => console.log('Listening on port', port))