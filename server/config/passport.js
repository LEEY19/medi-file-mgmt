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
    // console.log("innnn"+email)
    // console.log(email)
    // const chicken = await User.findAll({
    //   where: {email}  
    // });
    // console.log(chicken);


    User.findOne({
      where: {email} 
    })
    .then(async (user) => {
      // user = user.dataValues
      const userData = user.dataValues;
      // if (err) { return done(err); }
      if (!user) { return done(null, false); }

      const result = await new Promise((resolve, reject) => {
        bcrypt.compare(password, userData.password, function(err, result) {
          if (err) reject(err)
          resolve(result)
        });
      });

      if (!result) { return done(null, false); }
      // if (!user.verifyPassword(password)) { return done(null, false); }
      user.token = user.generateJWT();
      return done(null, user);
    })
    .catch(err => {
      return done(err);
    })
  }));


};
