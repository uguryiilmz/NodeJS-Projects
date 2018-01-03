const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;

const USERS = 'users';
const DEFAULT_USERS= './users';
const DEFAULT_INDEXES = { name: 'text', gender: 'text' };

function Users(db) {
  this.db = db;
  this.users = db.collection(USERS);
}


Users.prototype.getUser = function(id) {
  const searchSpec = { _id: id };
  return this.users.find(searchSpec).toArray().
    then(function(users) {
      return new Promise(function(resolve, reject) {
	if (users.length === 1) {
	  resolve(users[0]);
	}
	else {
	  reject(new Error(`cannot find user ${id}`));
	}
      });
    });
}

Users.prototype.checkUser = function(id) {
  const searchSpec = { _id: id };
  return this.users.find(searchSpec).toArray().
    then(function(users) {
      return new Promise(function(resolve, reject) {
	if (users.length === 1) {
	  resolve(users[0]);
	}
	else {
	  resolve(0);
	}
      });
    });
}

Users.prototype.newUser = function(id,item,password,token,time) {
 return this.users.insertOne({_id: id,item,password,token,time}).
		then(function(results) { 
     	 	return new Promise((resolve) => resolve(results.insertedId));      
    });
}

Users.prototype.deleteUser = function(id) {
  return this.users.deleteOne({_id: new ObjectID(id)}).
    then(function(results) {
      return new Promise(function(resolve, reject) {
	if (results.deletedCount === 1) {
	  resolve();
	}
	else {
	  reject(new Error(`cannot delete user ${id}`));
	}
      });
    });
}


Users.prototype.updateUsers = function(id,name) {
  const userSpec = { _id: ObjectID(id) };
  return this.users.replaceOne(userSpec, name).
    then(function(result) {
      return new Promise(function(resolve, reject) {
	if (result.modifiedCount != 1) {
	  reject(new Error(`updated ${result.modifiedCount}users `));
	}
	else {
	  resolve();
	}
      });
    });
}

Users.prototype.removeToken=function(id) {

  
  const userSpec = { _id: id };
   return this.users.update(userSpec, 
    { "$set" : { "token" : " " } }, 
    { "upsert" : true } ).
    then(function(result) {
      return new Promise(function(resolve, reject) {
	if (result.modifiedCount != 1) {
	 
	}
	else {
	  resolve();
	}
      });
    });
 }

Users.prototype.addToken=function(id,gen_token) {
 
  const userSpec = { _id: id };
   return this.users.update(userSpec, 
    { "$set" : { "token" : gen_token } }, 
    { "upsert" : true } ).
    then(function(result) {
      return new Promise(function(resolve, reject) {
	if (result.modifiedCount != 1) {
	}
	else {
	  resolve();
	}
      });
    });
}


module.exports = {
  Users: Users,
};

