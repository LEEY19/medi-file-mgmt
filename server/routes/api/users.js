const router = require('express').Router();
const auth = require('../auth');

const users = require("../../controllers/user.controller.js");

module.exports = app => {

  //POST new user route (optional, everyone has access)
  router.post('/', auth.optional, users.signUp)

  //POST login route (optional, everyone has access)
  router.post('/login', auth.optional, passport.authenticate('local'), users.logIn)
  
  //GET current route (required, only authenticated users have access)
  router.get('/current', auth.required, users.current)

  //delete user, update user info such as email, get all users are skipped in this exercise
};