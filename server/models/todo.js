const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {  
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }, 
  _creator: {
    type: mongoose.Schema.Types.ObjectId, // set the type to be ObjectId because we use model here, not schema
    required: true
  }
});

module.exports = { Todo };