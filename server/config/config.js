const env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test') {
  const config = require('./config.json');
  // set the keys and values in config.json to envConfig variable in case the env is test or dev
  const envConfig = config[env];

  // Object.keys get all the keys of a object into an array.
  // loop through all keys and set the values of envConfig obj to process.env object
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
} 




//////////// OLD CONFIG, moved all configs into config.json
// if(env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/Todo';
// } else if(env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoTest'
// }