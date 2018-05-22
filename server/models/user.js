const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// cannot write methods on model, so we have to use schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      // validator: (value) => {
      //   return validator.isEmail(value); 
      // },
      /////s shorthand way
      validator: validator.isEmail, // => return true / false
      message: `{VALUE} is not valid email`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }, 
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// override toJSON method. mongodb will use this method to parse obj into JSON before sending back, so we override it to limit what can be sent back.
UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject(); // convert into a regular object where only properties in the database document exists

  return _.pick(userObject, ['_id', 'email']); // we just want to send back id and email
}

// arrow function cannot bind keyword 'this', so we use old function declaration
UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  // first arg is data object (_id and access), second is the salt. this method return an obj so we use toString()
  const token = jwt.sign({_id: user._id.toHexString(), access}, 'secret').toString();

  user.tokens.push({ access, token });
  // if push() not work due to mongodb version conflict, use concat()
  // user.tokens = user.tokens.concat([{ access, token }]);

  // return the whole promise so that in server.js, we can chain .then() after this method 
  // the inside return just returns the value to use in this function, we have to return outside for the whole function
  return user.save().then(() => {
    return token;
  });
};

// use statics to create a model method, not a method for instance, kind of like prototype
UserSchema.statics.findByToken = function(token) {
  const User = this; // 'this' refers to the User model
  let decoded;
  
  try {
    decoded = jwt.verify(token, 'secret');
  } catch(e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    /////shorthand for reject()
    return Promise.reject();
    // this method returns a promise for server.js to chain more methods, so if auth fails, we return a Promise.reject() so server.js can use catch() to handle error.
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token, // quotes '' is required when the key is like tokens.token, _id alone is not required quotes
    'tokens.access': 'auth'
  });
};

// pre() is a middleware method of mongoose => use next(), we use it to run something right before another method, in this case save()
UserSchema.pre('save', function(next) {
  const user = this;

  // we don't want it to hash multiple times, like when user update something else. So we use a built-in method isModified() to check and only hash password if it's modified.
  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };