const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

const users = []

// allow json body
app.use(express.json())

app.get('/users', (req, res) => {
    res.json(users)
}) 

app.post('/users', async (req, res) => {
    try {

         /* Explicitly showing what hash is doing (i.e. hash of data + salt)
        const salt = await bcrypt.genSalt(10) // the default salt length is 10
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        */

        // A one-liner for hashing
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        // Create new user
        const user = {
            "name" : req.body.name,
            "password" : hashedPassword
        }

        // add to 'database'
        users.push(user)
        res.status(201).send('user added')
        
    } catch (error) {
        res.status(500).send('Server error')
    }
})

app.post('/users/login', async (req, res) => {

    const user = users.find(user => user.name === req.body.name)
    if (user == null){
        return res.status(400).send('cannot find user')
    }

    try {

        // Takes 1) unhashed and 2) hashed inputs
        // Then takes the salt from (2)
        // Then makes sure that (1) + salt hashes to the same thing
        if( await bcrypt.compare(req.body.password, user.password)){
            res.send('Success')
        } else {
            res.send('Not Allowed')
        }

    } catch (error) {

        res.status(500).send()
    }
})

app.listen(3000)