let router = require('express').Router();
let conn = require('../../conn');
let objectId = require('mongodb').ObjectID;

let db;

router.all('*', (req, res, next) => {
  db = req.app.locals.db;
  next();
});

router.route('/:userId/skills')
  .get((req, res, next) => {
    db.collection('users').findOne(
    {_id: new objectId(req.params.userId)}, 
    {_id: 0, skills: 1}, 
    (err, results) => {
      if (err) {
        next(err);
      } else {
        if (results) { //check the results is not null
          res.send(results.skills);
        } else {
          res.send([]);
        }
      }
      console.log('Get skills');
      db.close();
    });
  })

  .post((req, res, next) => {
    let skill = req.body;
    db.collection('users').findOne(
    {_id: new objectId(req.params.userId), 
    skills: {$elemMatch: {skillName: skill.skillName}}},
    (err, results) => {
      if (err) {
        next(err);
      } else { 
        if (results) { //if skill exists send response
          res.send({
            success: false, 
            message: skill.skillName + ' is already in your skills'
          });
        } else {
          db.collection('users').updateOne(
          {_id: new objectId(req.params.userId)},
          {$addToSet: {skills: skill}}, 
          (err, results) => {
            if (err) { 
              next(err);
            } else {
              res.send({
                success: true, 
                message: skill.skillName + ' has been added to your skills'
              });
              console.log('Skill added');
            } 
          });
        }
      }
      db.close();
    });
  })

  .put((req, res, next) => {
    db.collection('users').updateOne(
    {_id: new objectId(req.params.userId), 'skills.skillName': req.body.skillName}, 
    {$set: {'skills.$.expertiseLevel': req.body.expertiseLevel}}, 
    (err, results) => {
      let resultsParsed = JSON.parse(results);
      if (err) {
        next(err);
      } else { //check if the skill matches
        if (resultsParsed.n > 0) {
          res.send({
            success: true, 
            message: 'your ' + req.body.skillName + ' skill has been updated'
          });
        } else {
          res.send({
            success: false, 
            message: req.body.skillName + ' isn\'t in your skills'
          });
        }
      }
      db.close();
    });
  });
  
router.delete('/:userId/skills/:skillName', (req, res, next) => {
  db.collection('users').updateOne(
  {_id: new objectId(req.params.userId)}, 
  {$pull: {skills: {skillName: req.params.skillName}}}, 
  (err, results) => {
    let resultsParsed = JSON.parse(results); 
    if (err) {
      next(err);
    } else {
      if (resultsParsed.nModified > 0) {
        res.send({
          success: true, 
          message: 'your ' + req.params.skillName + ' skill has been deleted'
        });
        console.log('Skill deleted');
      } else {
        res.send({
          success: false, 
          message: req.params.skillName + ' isn\'t in your skills'
        });
        console.log('Skill doesn\'t exist');
      }
    }
    db.close();
  });
});


module.exports = router;