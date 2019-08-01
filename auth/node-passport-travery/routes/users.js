const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

// User model
const User = require('../models/User')

// Login page
router.get('/login', (req, res) => {
    res.render('login')
})

// Register page
router.get('/register', (req, res) => {
    res.render('register')
})

// Register handle
router.post('/register', (req, res) => {
    const { name, email, password, password2} = req.body
    let errors = []

    // check required fields
    if(!name || !email || !password || !password) {
        errors.push({msg: 'Please in all fields'})
    }

    // check passwords match
    if(password !== password2){
        errors.push({msg: 'Passwords do not match'})
    }

    // // check pass length
    // if(password.length < 6) {
    //     errors.push({msg: 'Password should be at least 6 characters'})
    // }

    // if there was an error
    if(errors.length > 0) {
        // re-render register page but keep existing variables
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    // if form validation passed..
    } else {
        User.findOne({"email":email})
          .then(user => {
              console.log('user',user)
              if(user) {
                // User exists
                console.log('user exists')
                errors.push({msg: 'Email is already registered'});
                
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
              } else {
                console.log('user does not exist')
                const newUser = new User({
                    name,
                    email,
                    password
                });

                console.log(newUser);
                res.send('hello');
              }
          })
    }

})

module.exports = router