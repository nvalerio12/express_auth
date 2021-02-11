require('dotenv').config();

const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
// import passpot Config, comeback later
const flash = require('connect-flash');
const passport = require('passport');


const app = express();
app.set('view engine', 'ejs');
const SECRET_SESSION = process.env.SECRET_SESSION

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

// secret: What we actually will be giving the user on our site as a session cookie
// resave: Save the session even if it's modified, make this false
// saveUninitialized: If we have a new session, we save it, therefore making that true
const sessionObject = {
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}
app.use(session(sessionObject));

app.use(session(sessionObject));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Flash
app.use(flash());
app.use((req, res, next) => {
  console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
}) 

// Routes 
app.use('/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
