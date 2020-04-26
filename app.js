const express = require('express');
const session = require('express-session');

const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const models = require('./server/models');
const router = require('./server/routes/index');

const PORT = process.env.PORT || 8080;

//Initiate our app
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
var myStore = new SequelizeStore({
    db: models.sequelize
})
app.use(session({ 
  secret: 'medi-file-mgmt', 
  cookie: { maxAge: 60000 }, 
  resave: false, 
  saveUninitialized: false,
  store: myStore
}))

myStore.sync();

app.use(passport.initialize());
app.use(passport.session());
require('./server/config/passport')(passport)

app.use('/', router)

models.sequelize.sync()  
// models.sequelize.sync({force: true})
.then(function() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});
