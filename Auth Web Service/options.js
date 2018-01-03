#!/usr/bin/env nodejs

'use strict';

const assert = require('assert');
const path = require('path');
const process = require('process');

const minimist = require('minimist')


const mongo = require('mongodb').MongoClient;
const users = require('./model/users');
const model = require('./model/model');
const server = require('./server/server');

const DB_URL = 'mongodb://localhost:27017/project3';


const OPTS = [
  ['t', 'auth-time' ],
  ['d', 'ssl-dir' ]
];

const DEFAULT_AUTH_TIMEOUT = 300;
const DEFAULT_SSL_DIR = '.';

function usage(prg) {
  const opts = OPTS.map(function(opt) {
    const value = opt[1].replace('-', '_').toUpperCase();
    return `[ -${opt[0]}|--${opt[1]} ${value} ]`
  });
  console.error(`usage: ${path.basename(prg)} ${opts.join(' ')} PORT`);
  process.exit(1);
}

function getOptions(argv) { 
  const opts0 = OPTS.reduce((a, b) => a.concat(b), []);
  const opts = minimist(argv.slice(2));
  if (opts._.length !== 1) usage(argv[1]);
  for (let k of Object.keys(opts)) {
    if (k === '_') continue;
    if (opts0.indexOf(k) < 0) {
      console.error(`bad option '${k}'`);
      usage(argv[1]);
    }
  }
  return {
    port: opts._[0],
    authTimeout: opts.t || opts['auth-time'] || DEFAULT_AUTH_TIMEOUT,
    sslDir: opts.d || opts['ssl-dir'] || DEFAULT_SSL_DIR
  };
}

module.exports = {
  options: getOptions(process.argv)
};

if (!module.parent) {
  console.log(getOptions(process.argv));
  console.log("ugur", getOptions(process.argv[0]));
}

//console.log("ugur",getOptions(process.argv[0]));




