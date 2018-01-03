#!/usr/bin/env nodejs

const assert = require('assert');
const process = require('process');
const app = require('./app');
const options = require('./options').options;
//const options=require('./options');




//const port=process.argv[2]
//const url=process.argv[3]
//console.log('port is',port);
//console.log('url is',url);
//console.log(url)
app.serve(options);


