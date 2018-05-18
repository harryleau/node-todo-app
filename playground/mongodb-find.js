const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoAppNew');

  // db.collection('Todos')
  //   .find({_id: new ObjectID('5afe9431335578036ca6b4a7')})
  //   .toArray()
  //   .then(docs => {
  //     console.log('Todos');
  //     console.log(docs);
  //   }, err => {
  //     console.log('unable to fetch todos', err);
  //   });

  db.collection('Todos').find().count()
    .then(count => {
      console.log(`Todos count: ${count}`);
    }, err => {
      console.log('unable to fetch todos', err);
    });
  
  client.close();
});