const express = require('express');
const bodyParser = require('body-parser');


const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

function serve(port, model) {
  const app = express();
  app.locals.model = model;
  app.locals.port = port;
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });
}


function setupRoutes(app) {
  app.get('/',consoleLog(app));
  app.use('/users/:id',bodyParser.urlencoded({
    extended: true
  }));
  app.use('/users/:id', bodyParser.json());
  app.put('/users/:id', newUser(app));  //not REST but illustrates PUT
  app.get('/users/:id', getUser(app));
  app.use('/users/:id', bodyParser.json());
  app.use('/users/:id', cacheUser(app));
  app.post('/users/:id', updateUser(app));
  app.delete('/users/:id', deleteUser(app));
}

function requestUrl(req) {
  const port = req.app.locals.port;
  return `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
}
  
module.exports = {
  serve: serve
}

function consoleLog(app){
 return function(request, response){
	response.send('samplelog');
   }
}

function getUser(app) {
  return function(request, response) {
    const id = request.params.id;
    if (typeof id === 'undefined') {
      response.sendStatus(BAD_REQUEST);
    }
    else {
      request.app.locals.model.users.getUser(id).
	then((results) => response.json(results)).
	catch((err) => {
	  console.error(err);
	  response.sendStatus(NOT_FOUND);
	});
    }
  };
}

function updateUser(app){
	return function(request, response) {
   	 const id = request.params.id;
         const item=request.body;
   	 if (typeof id === 'undefined') {
     	      response.sendStatus(BAD_REQUEST);
   	 }
          else {
      		request.app.locals.model.users.updateUsers(id, item).
			then(function(id) {
			response.append('Location', requestUrl(request) + '/' + id);
			response.sendStatus(CREATED);
      		}).
      		catch((err) => {
			console.error(err);
		response.sendStatus(SERVER_ERROR);
     	 });
        }
  };
}

function cacheUser(app) {
  return function(request, response, next) {
    const id = request.params.id;
    if (typeof id === 'undefined') {
      response.sendStatus(BAD_REQUEST);
    }
    else {
      request.app.locals.model.users.getUser(id).
	then(function(user) {
	  response.locals.user = user;
	  next();
	}).
	catch((err) => {
	  console.error(err);
	  response.sendStatus(NOT_FOUND);
	});
    }
  }
}
    
function deleteUser(app) {
  return function(request, response) {
    const id = request.params.id;
    if (typeof id === 'undefined') {
      response.sendStatus(BAD_REQUEST);
    }
    else {
      request.app.locals.model.users.deleteUser(id).
	then(() => response.end()).
	catch((err) => {
	  console.error(err);
	  response.sendStatus(NOT_FOUND);
	});
    }
  };
}


function newUser(app) {
	return function(request, response) {
                const id=request.params.id;
                const item=request.body;
                
                if(typeof id==='undefined' || typeof item==='undefined'){
                  response.sendStatus(BAD_REQUEST);
                }
                else{
                  request.app.locals.model.users.getUserForUpdate(id).
                  then(function(res) {
                    if(res!==0) {
			request.app.locals.model.users.updateUsers(id,item).
			then(function(id){
				response.sendStatus(CREATED);
			}).
			catch((err)=>{
				console.error(err);
				response.sendStatus(SERVER_ERROR);
			}); 
                    }
                   else {
                   request.app.locals.model.users.newUser(id,item).
                           then(function(id) {
                                  response.append('Location', requestUrl(request) + '/' + id);
                                  response.sendStatus(CREATED);
                           }).
                   catch((err) => {
                          console.error(err);
                          response.sendStatus(SERVER_ERROR);
                  });
                  
                }
              });
              
         }; 
}  
}



