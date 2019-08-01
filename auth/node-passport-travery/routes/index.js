const express = require('express');
const router = express.Router();
const {ensureAuthenticated } = require('../config/auth')

// Welcome page
router.get('/', (req, res) => {
    res.render('welcome')
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        // access to req.user exists when a user is logged in
        name: req.user.name
    })
});

module.exports = router