const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Load User Model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
            
            // btw
            // 'done' is a call back function with optional positional variables
            // 1) error, 2) user and 3) options
            
            // Match User
            const user = await User.findOne({email: email})

            if (user == null) {
                return done(null, false, { message: 'That email is not registered' })
              }
          
            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: 'Password incorrect' })
                }
            } catch (e) {
                return done(e)
            }
        })
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}