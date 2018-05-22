const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/* /////// example hashing + salt using crypto-js
const message = 'I am user 3';

const hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

const data = {
  id: 4
};

// salt means adding something to the hash to make it completely unique
const token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if(resultHash === token.hash) {
  console.log('data was not changed');
} else {
  console.log('data was changed');
}

*/

////////// JSON WEB TOKEN
/*
const data = {
  id: 10
};

const token = jwt.sign(data, 'abc123');
console.log(`token: ${token}`);

const decoded = jwt.verify(token, 'abc123');
console.log(`decoded: ${decoded}`);

*/

////////// HASHING PASSWORD WITH BCRYPTJS
const password = '123abc';

// the salt is built-in, all we need is just a password and number of rounds we want it to hash. 10 is the norm, the more round we set, the longer the process would take.
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

const hashed = '$2a$10$dYwHMkbvkl1yHnbGgkxLMe09EFPC3v5n.0QUczbOudOVSgiHm19ZW'; // this is the hashedPassword of '123abc'

bcrypt.compare(password, hashed, (err, res) => {
  console.log(res); // return true / false
});