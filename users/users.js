let app = require('express').Router();
let conn = require('../conn');
let db;

app.use((req, res, next) => {
  db = conn.db;
  next();
});

// users/
app.get('/', (req, res) => {
  db.collection('users').find().toArray( (err, results) => {
    res.send(results);
  }); 
});

module.exports = app;