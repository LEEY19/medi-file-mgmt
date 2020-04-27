// const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require("../models");
const User = db.user;

module.exports = (passport) => {
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {

    User.findOne({
      where: {email} 
    })
    .then(async (user) => {
      // user = user.dataValues
      // if (err) { return done(err); }
      if (!user) { return done(null, false); }
      const userData = user.dataValues;

      const result = await new Promise((resolve, reject) => {
        bcrypt.compare(password, userData.password, function(err, result) {
          if (err) reject(err)
          resolve(result)
        });
      });

      if (!result) { return done(null, false); }
      user.token = user.generateJWT();
      return done(null, user);
    })
    .catch(err => {
      return done(err);
    })
  }));


};
