const express = require('express');
const passport = require('passport');
const db = require('../models');
const router = express.Router();


//import DB
const db = require('../models');

router.get('/signup', (req, res) => {
  res.render('auth/signup');// This is a form
});

router.get('/login', (req, res) => {
  res.render('auth/login');// This is a form
});

// What routes do we need (post routes)
router.post('/signup', (req, res) => {
  // We now have access to user info via(req.body)
  const {email, name, password} = req.body; // Goes and gives us access to whatever key/value inside of the object(req.body)
  db.user.findOrCreate({
    where: { email }, 
    defaults: { name, password }
  })
  .then(([user, created]) => {
    if(created) {
      // if created, success (means user was created) gets redirrect to homepage
      console.log(`${user.name} was created....`);
      //Flash message
      const successObject = {
        successRedirect: '/',
        successFlash: `Welcome ${user.name}. Account was created and logging in....`
      }
      // Passport authenticate
      passport.authenticate('local', successObject);
    } else {
      // This where we get user already exists
      req.flash('error', 'Email already exists');
      res.redirect('/auth/signup');
    }
  })
.catch(error => {
  console.log(error);
  req.flash(`erro`, `Either email or password is incorrect. Please try again.`)
})

module.exports = router;
