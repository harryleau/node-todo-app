const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/*
Todo.remove({})
. then(result => {
  console.log(result); // we can't get the item back, we just got a result of obj with tons of info.
});
*/

// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()

// Todo.findOneAndRemove({_id: '5b02ef81b228611ad80ee2f3'})
//   .then(todo => console.log(todo)); // we can query with more param

Todo.findByIdAndRemove('5b02ef81b228611ad80ee2f3')
  .then(todo => console.log(todo)); // get the item obj back