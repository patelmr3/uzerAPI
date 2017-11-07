let mongo = require('mongodb').MongoClient;

//connect to mongo database
module.exports = function (req, res, next) {//3t0RaCbh6SyXB9aI
  const url = 'mongodb://maulik:3t0RaCbh6SyXB9aI@cluster0-shard-00-00-lcqyw.mongodb.net:27017,cluster0-shard-00-01-lcqyw.mongodb.net:27017,cluster0-shard-00-02-lcqyw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
  //const url = 'mongodb://localhost:27017/uzers';
  //const url = 'mongodb://maulik:987654@ds245755.mlab.com:45755/uzer';
  mongo.connect(url, (err, db) => {
    if(err) next(err);
    console.log("Connected to database");
    req.app.locals.db = db;
    next();
  })
};


// mongo "mongodb://cluster0-shard-00-00-lcqyw.mongodb.net:27017,cluster0-shard-00-01-lcqyw.mongodb.net:27017,cluster0-shard-00-02-lcqyw.mongodb.net:27017/test?replicaSet=Cluster0-shard-0" --authenticationDatabase admin --ssl --username maulik --password 3t0RaCbh6SyXB9aI
