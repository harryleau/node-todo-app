require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT;

// use bodyparser to parse json req to js obj  => can use req.body to get req object
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text // can get req.body due to jsonparser
  });

  todo.save().then(doc => {
    res.send(doc);
  }, e => {
    res.status(400).send(e); // send bad status back when error occurs
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then(todos => { // find() returns a promise
    res.send({todos}); // pass todos array back into an obj
  }, e => {
    res.status(400).send(e);
  })
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send({});
  } 
    
  Todo.findById(id)
    .then(todo => {
      if(!todo) {
        return res.status(404).send({});
      } 

      res.send({todo});
    })
    .catch(e => res.status(400).send({}));
  
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }

  Todo.findByIdAndRemove(id)
    .then(todo => {
      if(!todo) {
        return res.status(404).send({});
      }
      return res.send({todo});
    })
    .catch(e => res.status(400).send({}));

});

app.patch('/todos/:id', (req, res) => {
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

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true }) // new: true = returnOriginal: false
    .then(todo => {
      if(!todo) {
      return res.status(400).send();
      }
      res.send({todo});
    })
    .catch(e => res.status(400).send());
  
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };