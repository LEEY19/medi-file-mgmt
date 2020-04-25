const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require("../models");
const User = db.user;

passport.serializeUser((user, done) => {
  done(null, user.primaryKey)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id)
  .then(user => {
    done(null, user)
  })
  .catch(err => {
    done(err);
  });
});

passport.use(new LocalStrategy((email, password, done) => {
    
  User.findOne({
    where: {
      email: email
    }
  }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    bcrypt.compare(password, user.password, function(err, result) {
      if (!result) {
        return done(null, false);
      };
    });
    // if (!user.verifyPassword(password)) { return done(null, false); }
    user.token = user.generateJWT();

    return done(null, user);
  });
}));
