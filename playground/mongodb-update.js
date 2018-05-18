const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoAppNew');

  // find one and update
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID("5afedb271449c8f62ac91737")
  //   }, {
  //     $set: {
  //       completed: true
  //     }
  //   }, {
  //     returnOriginal: false
  //   })
  //   .then(result => console.log(result));
  
  // client.close();

  db.collection('Users').findOneAndUpdate({
    _id: 123
    }, { 
      $set: { name: 'Mike' }, 
      $inc: { age: 1} 
    }, { 
      returnOriginal: false 
    })
    .then(result => console.log(result));

  client.close();
});