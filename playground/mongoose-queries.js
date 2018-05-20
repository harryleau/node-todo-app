const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const id = '5b019166a7e44e2bf8c49537';

if(!ObjectID.isValid(id)) {
  console.log('ID not valid');
}

Todo.find({
  _id: id  // mongoose auto convert id into objectID
}).then(todos => {
  if(todos[0] === undefined) {
    return console.log('todos: not found');
  }
  console.log('Todos', todos); // return an array
});

Todo.findOne({
  _id: id
}).then(todo => {
  if(!todo) {
    return console.log('todo: not found')
  }
  console.log('Todo', todo); // return one object
});

Todo.findById(id)
  .then(todo => {
    if(!todo) {
      return console.log('todo by id: not found'); // this for handling id not found
    }
    console.log('todo By Id: ', todo); // return one object
  })
  .catch(e => console.log(e)); 
  // use catch for handling invalid id but the error 'e' is a very long object => require mongodb.OBjectID to check if ID is valid

User.findById('5afee7926a5dcc136c7667b3')
  .then((user) => {
    if(!user) {
      return console.log('user not found');
    }
    console.log('User found: ', user);
  }, (e) => {
    console.log(e);
  });


