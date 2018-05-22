const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

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
const data = {
  id: 10
};

const token = jwt.sign(data, 'abc123');
console.log(`token: ${token}`);

const decoded = jwt.verify(token, 'abc123');
console.log(`decoded: ${decoded}`);