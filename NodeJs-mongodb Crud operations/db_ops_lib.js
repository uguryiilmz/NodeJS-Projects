'use strict';

const assert = require('assert');
const mongo = require('mongodb').MongoClient;


//used to build a mapper function for the update op.  Returns a
//function F = arg => body.  Subsequently, the invocation,
//F.call(null, value) can be used to map value to its updated value.
function newMapper(arg, body) {
  return new (Function.prototype.bind.call(Function, Function, arg, body));
}

//print msg on stderr and exit.
function error(msg) {
  console.error(msg);
  process.exit(1);
}

//export error() so that it can be used externally.
module.exports.error = error;


//auxiliary functions; break up your code into small functions with
//well-defined responsibilities.

//perform op on mongo db specified by url.
function dbOp(url, op) {
        
    console.log("Op is "+ op);
    mongo.connect(url, function(err, db) { //connect mongoDB  
    console.log("Connected correctly to server");
    //var config=require('./ugur.json');
    let config=JSON.parse(op); //parsing the op part which is coming from command line
    var collection=config.collection; //collection name
    console.log("collection is ",config.collection);
    console.log("config arg is ", config.args);
    //console.log("arg is "+ JSON.stringify(op));
    let size = config.args
    //console.log("deneme "+ config.op);
    if(config.op==="create" && config.args.length !=0){ // if op is create and not empty args, it inserts 
                                                        //into db
        db.collection(collection).insert(config.args);
   }
   else if(config.op=="create" && config.args.length===0){ //if it is  an empty args, it raises an error
        console.error("ARG SHOULD NOT BE EMPTY");
   }
   else if(config.op==="read"){ //read the collection specified by args
        console.log("Read data from the server");
        db.collection(collection).find(config.args).toArray(function(err, docs) 
        {
                assert.strictEqual(err, null);
                console.log(docs);
        });
   }
    else if(config.op==="delete"){ //delete whole the collection specified by args
        if(config.args===undefined){
                console.log("Deleting all data from the server");
                db.collection(collection).deleteMany({}, function(err, r) {
                        assert.strictEqual(err, null);
                        console.log("{collection} cleared");
                
                });
         }
        else if(config.args!=undefined){ //delete only one collection specified by arg
                console.log("Deleting data from the server" );
                db.collection(collection).deleteOne(config.args,function(err,r){
                if(err) 
                        throw err;
        
                });
        }

   } 

   else if(config.op==="update"){ //update the collection specified by mapper 
        var mapper=newMapper(config.fn[0],config.fn[1]);
        var doc; //store collection from find().toArray method
        var length=0; //length and counter to loop through collection for update operation
        db.collection(collection).find({}).toArray(function(err,docs)
        {
                assert.strictEqual(err,null);
                doc=docs; //store the results coming from find
                console.log("doc is ", doc);
                //while(length!=doc.length){
                        //db.collection(collection).updateOne(doc[length],mapper.call(null,doc[length]),function(err,docs)
                        //{
                        //      assert.strictEqual(err,null);
                                
                //      });
                //length=length+1;
                //}
        });

          }

        setTimeout(function () { //timeout to prevent db to close before update process
                 db.close()
        }, 100)
        
}); 
}


//make main dbOp() function available externally
module.exports.dbOp = dbOp;
