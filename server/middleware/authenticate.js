const {User} = require('./../models/user');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth');

  User.findByToken(token)
    .then(user => {
      if(!user) {
        return Promise.reject(); // this will send the method to catch() just like in user.js
      }

      // modify the request, set it to the value we just found
      req.user = user;
      req.token = token;
      next(); // middleware require calling next();
    })
    .catch(e => {
      res.status(401).send(); // catch the reject() in user.js; 401 is unauthorized status
    });
};

module.exports = { authenticate };