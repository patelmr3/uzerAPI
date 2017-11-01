let mongo = require('mongodb').MongoClient;

//connect to mongo database
module.exports = function (req, res, next) {
  mongo.connect('mongodb://localhost:27017/uzers', (err, db) => {
    if(err) next(err);
    console.log("Connected to database");
    req.app.locals.db = db;
    next();
  })
};