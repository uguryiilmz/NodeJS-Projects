
const https = require('https');
const express = require('express');
const bodyParser=require('body-parser');
const fs=require('fs');
const randtoken=require('rand-token');
const bcrypt=require('bcrypt');
const options=require('../options');


//const key_pem=require('./key.pem');
//const cert_pem=require ('./cert.pem');

const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const SEE_OTHER=303;




function serve(port, model,authTimeout) {
  
  console.log("port is ", port);
  console.log("authTimeout is", authTimeout);
  const app = express();
  app.locals.model = model;
  app.locals.port = port;
  app.locals.authTimeout=authTimeout;
 // app.loacls.authTimeout=authTimeout;
  setupRoutes(app);
  https.createServer({
  	key: fs.readFileSync('./key.pem'),
  	cert: fs.readFileSync('./cert.pem'),
  }, app).listen(port,function(){
	console.log("listening on port = ", port);
       //console.log('listening on port ${port}');
  });  
  
}

function setupRoutes(app) {
  app.get('',consoleLog(app));
  app.use('/users/:id',bodyParser.urlencoded({
    extended: true
  }));
  app.use('/users/:id/:password', bodyParser.json());
  app.put('/users/:id/', newUser(app));
  app.get('/users/:id', getUser(app));
  app.put('/users/:id/auth', loginUser(app)); 


}

function requestUrl(req) {
  const port = req.app.locals.port;
  //const authTimeout=req.app.locals.authTimeout;
  return `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
}
  
module.exports = {
  serve: serve
}

function consoleLog(app){
 return function(request, response){
        var header=request.headers.authorization
	var bearer=header.split(" ");
	var bearerToken=bearer[1];
        response.send("deneem");
	console.log("header is", bearerToken);
       const authTimeout=options.options.authTimeout
       const port=options.options.port
       console.log("port is ", port)
       console.log("auth is", authTimeout)
   }
}


function newUser(app) {
	var authTimeout=options.options.authTimeout
        authTimeout=authTimeout*1000;
	//console.log(authTimeout)
	return function(request, response) {
                 const id=request.params.id;
                const item=request.body;
                const pass=request.query.pw;
		var token=randtoken.generate(16);
                var created_time=new Date().getTime();


                if(typeof id==='undefined' || typeof item==='undefined'){
                  response.sendStatus(BAD_REQUEST);
                }
                else{
                  request.app.locals.model.users.checkUser(id).
                  then(function(res) {
                    if(res!==0) {
                      response.json({
                        status: 'EXISTS',
                        info : 'user '+id +' already exists'
                      })
                      return;
                      response.append('Location', requestUrl(request) + '/' + id);
                      response.sendStatus(SEE_OTHER);
                    }
                   else {
                     bcrypt.hash(pass,10,function(err,hash){
                     request.app.locals.model.users.newUser(id,item,hash,token,created_time).
                             then(function(id) {
                                    response.json({
                                      status: 'CREATED',
                                      authToken: token
                                    })
                                    return;
                                    response.append('Location', requestUrl(request) + '/' + id);
                                    response.sendStatus(CREATED);
                             }).
                     catch((err) => {
                            console.error(err);
                            response.sendStatus(SERVER_ERROR);
                    });
		  });
			  setTimeout(function () {
                         console.log("kac sanye"); 
 		         request.app.locals.model.users.removeToken(id);
			}, authTimeout)
		}
              });

         };
}
}

 
function getUser(app) {
  
  return function(request, response) {
	const header=request.headers.authorization;
	const bearer=header.split(" ");
	const bearerToken=bearer[1];
	console.log("token is", bearerToken)
    const id = request.params.id;
    if (typeof id === 'undefined' || typeof bearerToken==='undefined') {
      response.sendStatus(BAD_REQUEST);
    }
    else {
       request.app.locals.model.users.getUser(id).
	then(function(results){
	      console.log("real token is ",results.token);
              if(results.token===bearerToken){
		 response.json(results);
	      }
	      else{
		 response.json({
                        status: 'Wrong authentication header or expired',
                        info : 'IF EXPIRED LOGIN AGAIN, IF HEADER IS WRONG PUT THE CORRECT HEADER'
                      })
	     }
	}).
	catch((err) => {
	  console.error(err);
	  response.sendStatus(NOT_FOUND);
	});

	
    }
  };
}




           

function loginUser(app){
  return (function(request, response) {
                const id=request.params.id;
                const item=request.body;
                const password=request.body.pw;

                if(typeof id==='undefined' || typeof item==='undefined'){
                  response.sendStatus(BAD_REQUEST);
                }
                else
                {
                  request.app.locals.model.users.checkUser(id).
                  then(function(res) {
                    var hash=res.password;
                    var token=res.token;
		            var time=res.time;
                    console.log('pass is', hash);
						if(res!==0) {
							if(token=== " "){
								console.log("token bos")
								var new_token=randtoken.generate(16);
								response.json({
                              status: 'EXPIRED TOKEN',
                              info :'YOU ARE REQUIRED TO LOGIN AGAIN'
                            });
							request.app.locals.model.users.addToken(id,new_token);
							}
							else{
								console.log("token bos degil")
								 bcrypt.compare(password, hash, function(err, res) {
                          if(res && typeof password!='undefined') {
			    console.log('tokennn', token);
     			    response.json({
                              status: 'OK',
                              authToken : token
                            })
                            return;
                            response.append('Location', requestUrl(request) + '/' + id);
                            response.sendStatus(OK);
                          }
                          else{
                            response.json({
                              status: 'ERROR_UNAUTHORIZED',
                              info :'/users/<ID>/auth requires a valid pw  password query parameter'
                            });
                            return;
                            response.append('Location', requestUrl(request) + '/' + id);
                            response.sendStatus(OK);
                          }
                      })
					}
                     
                    }
                   else {
                     response.json({
                       status: 'ERROR_NOT_FOUND',
                       info:'user ' + id + 'not found'
                     });
                     return;
                     response.append('Location', requestUrl(request) + '/' + id);
                     response.sendStatus(NOT_FOUND);
                   }
				
				    
				    
                 
              });

         }
		 
       });
}












