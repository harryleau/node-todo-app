require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

// use bodyparser to parse json req to js obj  => can use req.body to get req object
app.use(bodyParser.json());

////// TODOS ROUTES
app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id // can get req.body due to jsonparser
  });

  todo.save().then(doc => {
    res.send(doc);
  }, e => {
    res.status(400).send(e); // send bad status back when error occurs
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(todos => { // find() returns a promise
    res.send({todos}); // pass todos array back into an obj
  }, e => {
    res.status(400).send(e);
  })
});

app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id; // id of todo
  if(!ObjectID.isValid(id)) {
    return res.status(404).send({});
  } 
    
  Todo.findOne({
    _id: id,
    _creator: req.user._id // id of creator
  })
    .then(todo => {
      if(!todo) {
        return res.status(404).send({});
      } 

      res.send({todo});
    })
    .catch(e => res.status(400).send({}));
  
});

app.delete('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if(!todo) {
        return res.status(404).send({});
      }
      return res.send({todo});
    })
    .catch(e => res.status(400).send({}));

});

app.patch('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;

  // we don't want the user to update on other properties => use lodash.pick
  const body = _.pick(req.body, ['text', 'completed']); 

  if(!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }

  // check if input is valid value
  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    // if input not valid
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id: id, _creator: req.user._id
  }, { 
    $set: body 
  }, { 
    new: true // new: true = returnOriginal: false
  }) 
    .then(todo => {
      if(!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    })
    .catch(e => res.status(400).send());
  
});

//// USER ROUTES
app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  user.save().then(() => { // we don't need to add user arg as it's the same as the one above
    return user.generateAuthToken(); // this method returns a promise => we can chain .then() after it.
  })
  // set header 'x-auth' to token
  .then(token => {
    res.header('x-auth', token).send(user); // when prefix a header => create a custom header
  })
  .catch(e => res.status(400).send(e));
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header('x-auth', token).send(user);
      });
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch(e => res.status(400).send());
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };