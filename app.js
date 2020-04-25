const express = require('express');
const session = require('express-session');

const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const models = require('./server/models');

const PORT = process.env.PORT || 3000;

//Initiate our app
const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
  secret: 'medi-file-mgmt', 
  cookie: { maxAge: 60000 }, 
  resave: false, 
  saveUninitialized: false,
  store: new SequelizeStore({
      db: models.sequelize,
      table: 'Session'
   }),
}))

app.use(passport.initialize());
app.use(passport.session());
  
models.sequelize.sync().then(function() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});
