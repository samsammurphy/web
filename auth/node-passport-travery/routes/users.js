const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
// User model
const User = require('../models/User')


// Register page
router.get('/register', (req, res) => {
    res.render('register')
})

// Login page
router.get('/login', (req, res) => {
    res.render('login')
})

// Register handler
router.post('/register', async (req, res) => {
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

    // error in registration form = keep existing variables
    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {

    // form validation passed..
    user = await User.findOne({"email":email})
    
    // user exists
    if(user) {
        errors.push({msg: 'Email is already registered'});
        
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });

    // new user
    } else {

        try {
            
            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            const user = new User({
                name,
                email,
                password:hashedPassword
            });

            const newUser = await user.save()
            req.flash('success_msg', 'You are now registered and can login')
            res.redirect('/users/login')

        
        } catch(err){
            res.status(400).json({message: err.message})
        }
        
        // res.send('hello');
        }
    }
});

// Login Handler
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

// Logout Handler
router.get('/logout', (req, res) => {
    // logout using passport middleware
    req.logout();
    // UI message
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login')
})

module.exports = router