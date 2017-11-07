let router = require('express').Router();
let ObjectId = require('mongodb').ObjectID;
let conn = require('../conn');
let colors = require('./colors');
let db;

//connect to database
router.all('*', conn, (req, res, next) => {
  db = req.app.locals.db;
  next();
});

router.param('userId', (req, res, next, userId) => {
  //length of id must be 24
  if(userId.length !== 24) {
    res.status(400).json({status: 'fail', message: 'invalid id'});
  } else next();
});

router.route('/')
  //get all users
  .get((req, res) => {
    console.log(req.session.usrId);
    db.collection('users').find().sort({firstName:1}).toArray((err, results) => {
      res.json({results: results, status: 'success', data: req.session.usrId});
    }); 
    db.close();
  })
  //register new user
  .post((req, res, next) => {
    let objId = new ObjectId();
    db.collection('users').insertOne({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      jobPosition: req.body.jobPosition,
      _id: objId,
      profileColor: colors.getRandom()
    }, (err, results) => {
      if(err) {
        if(err.code === 11000) {
          res.send({
            status: 'fail', 
            message: 'User already registerd. Please use different email address'
          });
          console.log('Duplicate user');
        } else { 
          next(err) 
        }
      } else { 
        res.send({status: 'success', id: objId});
        console.log('New user registered');
      }
    })
    db.close();
  })
  //update user
  .put((req, res, next) => {
    db.collection('users').updateOne(
      {_id: ObjectId(req.body._id)}, 
      {$set: req.body.updates}, 
      (err, results) => {
        if(err) next(err);
        console.log(results);
        res.send({status: 'success'});
    });
    db.close();
  });

router.route('/:userId')
  //get user profile
  .get((req, res, next) => {
    db.collection('users')
    .findOne({_id: ObjectId(req.params.userId)}, (err, results) => {
      if(err) next(err);
      res.json({results: results, status: 'success'});
    })
    db.close();
  });
  

module.exports = router;