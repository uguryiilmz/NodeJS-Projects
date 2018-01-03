const users = require('./users');

function Model(db) {
  this.users = new users.Users(db);
  
}


module.exports = {
  Model: Model
};

