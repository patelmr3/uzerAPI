let router = require('express').Router();
let conn = require('../conn');
let objectId = require('mongodb').ObjectID;
let db;

router.all('*', conn, (req, res, next) => {
  db = req.app.locals.db;
  next();
});

router.route('/')

  .get((req, res) => {
    res.send('Getting skills');
  })

  .post((req, res, next) => {

    let skill = req.body.skill;
    let uId = req.body.uId;

    //check if the skill is an existing skill
    db.collection('users')
    .findOne({_id: objectId(uId), skills: {$elemMatch: {skillName: skill.skillName}}}, (err, results) => {
      if (err) {
        next(err);
      } else {
        //if skill exists send response
        if (results) {
          res.send({success: false, message: skill.skillName + ' is already in your skills'});
        } else {
          //if skill doesn't exist, update user with new skill
          db.collection('users')
          .updateOne({_id: new objectId(uId)}, {$addToSet: {skills: skill}}, 
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
    });

  })
  
  .put((req, res, next) => {
    let uId = req.body.uId;
    let skillName = req.body.skillName;

    db.collection('users')
    .updateOne({_id: new objectId(uId)}, {$pull: {skills: {skillName: skillName}}}, (err, results) => {
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
    });

  })


module.exports = router;