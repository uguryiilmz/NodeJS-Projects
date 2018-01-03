Command line node-js projects to get familliar with the crud operations in mongodb.
Aim of the project:
  To provide experience with writing a non-trivial JavaScript program.

  To understand the use and limitations of using aynchronous callbacks.

Sample Output:
  #list out file to be used for inserting entries
$ cat create.json
{
  "op": "create",
  "collection": "test",
  "args": [
    { "a": 1 },
    { "b": 2 },
    { "c": 3 }
  ]
}

#add entries to test
$ ./db_ops.js $URL "`cat create.json`"

#run mongo shell to show entries were inserted
$ mongo --eval 'db.test.find({})' test_db
MongoDB shell version: 3.2.11
connecting to: test_db
{ "_id" : ObjectId("59ac8f45557cf41ebdacaff1"), "a" : 1 }
{ "_id" : ObjectId("59ac8f45557cf41ebdacaff2"), "b" : 2 }
{ "_id" : ObjectId("59ac8f45557cf41ebdacaff3"), "c" : 3 }

#use a read op to show entries inserted
$ ./db_ops.js $URL '{"op": "read", "collection": "test" }'
{ _id: 59ac8f45557cf41ebdacaff1, a: 1 }
{ _id: 59ac8f45557cf41ebdacaff2, b: 2 }
{ _id: 59ac8f45557cf41ebdacaff3, c: 3 }

#filter read to only select {a: 1} entry
 ./db_ops.js $URL \
   '{"op": "read", "collection": "test", "args": { "a": 1 } }'
{ _id: 59ac8f45557cf41ebdacaff1, a: 1 }

#no results if we filter using {a: 2}
$ ./db_ops.js $URL \
  '{"op": "read", "collection": "test", "args": { "a": 2 } }'

#delete {a: 1} entry
$ ./db_ops.js $URL \
  '{"op": "delete", "collection": "test", "args": { "a": 1 } }'

#use mongo shell to verify entry deleted
$ mongo --eval 'db.test.find({})' test_db
MongoDB shell version: 3.2.11
connecting to: test_db
{ "_id" : ObjectId("59ac8f45557cf41ebdacaff2"), "b" : 2 }
{ "_id" : ObjectId("59ac8f45557cf41ebdacaff3"), "c" : 3 }

#use read op to verify entry deleted
$ ./db_ops.js $URL '{"op": "read", "collection": "test" }'
{ _id: 59ac8f45557cf41ebdacaff2, b: 2 }
{ _id: 59ac8f45557cf41ebdacaff3, c: 3 }

#list out file used for updating entries
$ cat update.json
{
  "op": "update",
  "collection": "test",
  "args": { },
  "fn": [ "x",
         "{ return typeof(x['b']) !== 'undefined' ? { b: 42 } : x; }" ]
}

#update collection test as per update.json OP.
$ ./db_ops.js $URL "`cat update.json`"

#read test collection to verify update
$ ./db_ops.js $URL '{"op": "read", "collection": "test" }'
{ _id: 59ac8f45557cf41ebdacaff2, b: 42 }
{ _id: 59ac8f45557cf41ebdacaff3, c: 3 }

#use mongo shell to verify update
$ mongo --eval 'db.test.find({})' test_db
MongoDB shell version: 3.2.11
connecting to: test_db
{ "_id" : ObjectId("59ac8f45557cf41ebdacaff2"), "b" : 42 }
{ "_id" : ObjectId("59ac8f45557cf41ebdacaff3"), "c" : 3 }

#delete all entries in test collection
$ ./db_ops.js $URL '{"op": "delete", "collection": "test" }'

#read test collection to verify delete
$ ./db_ops.js $URL '{"op": "read", "collection": "test" }'
$
