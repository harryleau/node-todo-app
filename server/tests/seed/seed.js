const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

// create a testing todo array
const todos = [{
  _id: new ObjectID(),
  text: 'first test todo',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: 'second test todo',
  completed: true,
  completedAt: new Date(),
  _creator: userTwoId
}];

// create a testing user array, second user doesn't have tokens

const users = [{
  _id: userOneId,
  email: 'harryle@test.com',
  password: 'harrylePassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'secret').toString()
  }]
}, {
  _id: userTwoId,
  email: 'amyvu@test.com',
  password: 'amyvuPassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, 'secret').toString()
  }]
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done())
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    const userOne = new User(users[0]).save();
    const userTwo = new User(users[1]).save();

    // userOne and userTwo return 2 promises. Promise.all() takes in an array of promises and only fire off when all promises are resolved.
    return Promise.all([userOne, userTwo])
      .then(() => done());
  });
};

module.exports = { todos, populateTodos, users, populateUsers };