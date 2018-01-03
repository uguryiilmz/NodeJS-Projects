#!/usr/bin/env nodejs

const assert = require('assert');
const mongo = require('mongodb').MongoClient;
const process = require('process');
const users = require('./model/users');
const model = require('./model/model');
const server = require('./server/server');
const options=require('./options');

const DB_URL = 'mongodb://localhost:27017/project3';


const port= options.options.port
const authTimeout=options.options.authTimeout
const sslDir=options.options.sslDir

console.log(port, authTimeout, sslDir);

mongo.connect(DB_URL).
  then(function(db) {
    const model1 = new model.Model(db);
    server.serve(port, model1,authTimeout);
   // db.close();
  }).
  catch((e) => console.error(e));

