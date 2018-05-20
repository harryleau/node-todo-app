const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };