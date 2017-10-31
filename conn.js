let mongo = require('mongodb').MongoClient;

console.log('calling connection');

//connect to mongo database
mongo.connect('mongodb://localhost:27017/uzers', (err, _db) => {
  if(err) throw new Error(err);
  console.log("Connected correctly to server");
  exports.db = _db;
});