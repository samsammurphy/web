if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
};

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')

const app = express();

// Passport authentication strategy
require('./config/passport')(passport)

// Connect to MongoDB (NoSQL database)
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// EJS (HTML template)
app.use(expressLayouts);
app.set('view engine', 'ejs');

// BodyParser (get HTML form variables in 'req.body')
app.use(express.urlencoded({extended:false}));

// Express Session (client-side memory)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport middleware (must come after express session)
app.use(passport.initialize());
app.use(passport.session());

// Connect flash (UI messages with 'req.flash')
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
});

//Routers
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const port = process.env.PORT || 3000;

app.listen(port, console.log('Listening on port', port));