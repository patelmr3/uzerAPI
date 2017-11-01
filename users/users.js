let router = require('express').Router();
let ObjectId = require('mongodb').ObjectID;
let conn = require('../conn');
let db;

//connect to database
router.all('*', conn, (req, res, next) => {
  //check if the database is connected
  if(req.app.locals.db) {
    db = req.app.locals.db;
    next();
  } else {
    res.status(500).send({
      status: 'fail', 
      message: 'could not connect to the databse'
    });
  }
})

// get all users
router.get('/', (req, res) => {
  db.collection('users').find().toArray( (err, results) => {
    res.json({results: results, status: 'success'});
    db.close();
  }); 
})

router.param('userId', (req, res, next, userId) => {
  //length of id must be 24
  if(userId.length !== 24) {
    res.status(400).json({status: 'fail', message: 'invalid id'});
  } else next();
})

//get single user
router.get('/:userId', (req, res) => {
  db.collection('users')
  .findOne({_id: ObjectId(req.params.userId)}, (err, results) => {
    if(err) console.log(err);
    res.json({results: results, status: 'success'});
    db.close();
  })
})

module.exports = router;