let router = require('express').Router();
let conn = require('../../conn');
let objectId = require('mongodb').ObjectID;

let db;

router.all('*', conn, (req, res, next) => {
  db = req.app.locals.db;
  next();
});

router.route('/:userId/skills')

  .get((req, res, next) => {
    db.collection('users')
    .findOne({_id: new objectId(req.params.userId)}, {_id: 0, skills: 1}, (err, results) => {
      
      if (err) {
        next(err);
      } else {
        //check if the results is not null
        if (results) { 
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

    let skill = req.body.skill;

    //check if the skill is an existing skill
    db.collection('users')
    .findOne({_id: new objectId(req.params.userId), skills: {$elemMatch: {skillName: skill.skillName}}}, (err, results) => {
      
      if (err) {
        next(err);
      } else {
        //if skill exists send response
        if (results) {
          res.send({success: false, message: skill.skillName + ' is already in your skills'});
        } else {
          //if skill doesn't exist, update user with new skill
          db.collection('users')
          .updateOne({_id: new objectId(req.params.userId)}, {$addToSet: {skills: skill}}, 
          (err, results) => {
            
            if (err) { 
              next(err);
            } else {
              res.send({success: true, message: 'skill added'});
              console.log('Skill added');
            } 

          });
        }
      }

      db.close();
    });

  })

  .put((req, res, next) => {

    let skillName = req.body.skillName;
    let expertiseLevel = req.body.expertiseLevel;

    db.collection('users')
    .updateOne({_id: new objectId(req.params.userId), 'skills.skillName': skillName}, {$set: {'skills.$.expertiseLevel': expertiseLevel}}, (err, results) => {
      
      let resultsParsed = JSON.parse(results);

      if (err) {
        next(err);
      } else {
        //check if the skill matches
        if (resultsParsed.n > 0) {
          res.send({success: true, message: 'skill updated'});
        } else {
          res.send({success: false, message: 'skill doesn\'t exist'});
        }
      }

      db.close();
    });

  })
  
  .delete((req, res, next) => {
    
    let skillName = req.body.skillName;

    db.collection('users')
    .updateOne({_id: new objectId(req.params.userId)}, {$pull: {skills: {skillName: skillName}}}, (err, results) => {
      let resultsParsed = JSON.parse(results); 
      
      if (err) {
        next(err);
      } else {
        
        if (resultsParsed.nModified > 0) {
          res.send({success: true, message: 'skill updated'});
          console.log('Skill updated');
        } else {
          res.send({success: false, message: 'skill doesn\'t exist'});
          console.log('Skill doesn\'t exist');
        }

      }

      db.close();
    });

  });


module.exports = router;