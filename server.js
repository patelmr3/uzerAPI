let express = require('express');
let users = require('./users/users');
let conn = require('./conn');

let app = express();
let db;

//connect to database
app.all('*', conn, (req, res, next) => {
  db = req.app.locals.db;
  next();
});

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', 'content-type');
  next();
});

//API welcome message
app.get('/', (req, res) => {
  db.collection('users').count((err, results) => {
    res.send({
      message: 'Welcome to Uzer API',
      totalUsers: results,
      cookies: req.cookies
    });
  });
});

//router: users
app.use('/users', users);

//login
app.post('/login', (req, res) => {
  db.collection('users')
    .findOne({
      firstName: req.body.firstName,
      email: req.body.email
    }, (err, results) => {
      if(err) next(err);
      if(results) {
        res.send({
          status: 'success', 
          message: 'login successful', 
          data: results
        });
      } else {
        res.send({status: 'fail', message: 'No user found'});
      }
    });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err);
});

//app: start-server
app.listen(3030, (err) => { 
  if(err) console.log(err);
  console.log('Listening at https://localhost:3030'); 
});