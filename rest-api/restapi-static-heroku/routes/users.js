const express = require('express')
const router = express.Router()
const User = require('../models/users')

// getting all
router.get('/', async (req, res) => {

    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// getting one
router.get('/:id', getUser, (req, res) => {
    res.json(res.user)
})

// creating one
router.post('/', async (req, res) => {

    const user = new User({
        name: req.body.name,
        geo:req.body.geo

    })

    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    
    } catch(err){
        res.status(400).json({message: err.message})
    }
    
})

// updating one
router.patch('/:id', getUser, async (req, res) => {
    if (req.body.name != null){
        res.user.name = req.body.name
    }
    if (req.body.geo != null){
        res.user.geo = req.body.geo
    }
    try {
        const updateUser = await res.user.save()
        res.json(updateUser)
    } catch(err) {
        res.status(400).json({message: err.message})
    }
})

// deleting one
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.remove()
        res.json({message: 'deleted user'})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
    
})

// Custom Middleware = find user by ID and add to request parameter
async function getUser(req, res, next){
    let user
    
    try {
        user = await User.findById(req.params.id)
        if (user == null){
            return res.status(404).json({message:'cannot find user'})
        }
    } catch(err){
        return res.status(500).json({message: err.message})
    }

    res.user = user
    next()
}


module.exports = router