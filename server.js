let express = require('express');
let bodyParser = require('body-parser');
let conn = require('./conn');
let app = express();

let users = require('./users/users');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to Uzer API');
});

//everything users
app.use('/users', users);

app.listen(3030, (err) => { 
  if(err) console.log(err);
  console.log('Listening at https://localhost:3030') 
});