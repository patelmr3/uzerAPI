let express = require('express');
let users = require('./users/users'); //router-import: users

let app = express();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());

//API welcome message
app.get('/', (req, res) => {
  res.send('Welcome to Uzer API');
})

//router: users
app.use('/users', users);

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

//app: start-server
app.listen(3030, (err) => { 
  if(err) console.log(err);
  console.log('Listening at https://localhost:3030') 
})