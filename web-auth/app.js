

const express = require('express');
const fs=require('fs')
const path = require('path');
const https=require('https')
var expressValidator = require('express-validator');
const axios=require('axios')
const bodyParser = require('body-parser');
const httpsAgent=require('https-agent')
const flash = require('connect-flash');
const session = require('express-session');
const http=require('http')
const utf8 = require('utf8');
var cookieParser = require('cookie-parser')
var methodOverride = require('method-override')
//const port=3002

// Init App
//const app = express();



/*
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('your secret here'));
app.use(methodOverride());
app.use(session());
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});





// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

*/


// Set Public Folder
function setupRoutes(app,url) {
	app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('your secret here'));
app.use(methodOverride());
app.use(session());
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'pug');
	app.get("/register",register(app));
	app.post("/register",addUser(app,url));
	app.post('/login',loginSession(app,url));
	app.get('/login',login(app));
	app.get('/account',account(app,url));
	app.get('/logout',logout(app));
}


function  login(app){
	return function(req,res){
		res.render('login')
	}
}

function register(app){
	return function(req,res){
		res.render('register')
	}
}

function addUser(app,url,port){
	return function(req,res){
		const firstname=req.body.firstName;
		const lastName=req.body.lastName;
		const eMail=req.body.userName;
		const password=req.body.password;
		const password2=req.body.password2;
		const regularExpression=/^(?=.*[0-9])(?=\S+$).{8,}$/;
		req.checkBody('firstName', 'Name is required').notEmpty();
		req.checkBody('userName', 'Email is required').notEmpty();
		req.checkBody('userName', 'Email is not valid').isEmail();
		req.checkBody('lastName', 'Username is required').notEmpty();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

		console.log('password is',password)
		console.log('gelen sonuc is',password.search(regularExpression))
		var errors=req.validationErrors();
		if(errors || password.search(regularExpression)===-1){
			console.log(errors)
			res.render('register',{
				errors:errors 
			});		
		}
		else{
			axios({
			method: 'PUT',
			url: 'https://' +  url +  '/users/'+ eMail + '?pw=' + password,
			httpsAgent: new https.Agent({  
    				rejectUnauthorized: false
  			}),
			data: {
				name: firstname,
				lastname :lastName
				//deneme:'ugur yilmaz'
			}
		}).then(wsResponse => {
			console.log('deneme')
			const result = wsResponse.data;
			if (result.status != "CREATED") {
				req.session.error = result.info;
				res.redirect('/register');
			} else {
				req.session.email = req.body.userName;
				req.session.authToken = result.authToken;
				res.redirect('/account');
			}
		}).catch(error => {
			console.log(error)
			//console.log(error)
			if (error.response) {
				req.session.error = error.response.data.info;
			}
			res.redirect('/register');
		})

					
		}
	
	}
}




function account(app,url,port){
	return function(req,res){
		console.log('req session is'+ req.session.email)
		console.log('req token is'+req.session.authToken)
		//console.log('response status is',response.status)
		axios({
			method: 'GET',
			url: 'https://'+ url + '/users/' + req.session.email ,
			httpsAgent: new https.Agent({  
   				 rejectUnauthorized: false
  			}),
			headers: {
				'Authorization' :'Bearer'+ ' '+ req.session.authToken
			}
		}).then(wsResponse => {
			console.log('url is',url)
			console.log('response is',wsResponse.status)
			const result = wsResponse.data;
			if (wsResponse.status != 200) {
				console.log('bugra')
				req.session.error = result.info;
				res.redirect('/login');
			} else {
				var name=result.name;
				var lastname=result.lastname;
				console.log('name is',name)
				console.log('lastname is',lastname)
				 res.render('account', {
      					name:name,
					lastname:lastname
    				});
			}
		}).catch(error => {
			console.log('error is',error)
			console.log('errorrrr')
			//console.log(error)
			if (error.response) {
				req.session.error = error.response.data.info;
			}
			res.redirect('/login');
		})

	}
}


function loginSession(app,url,port){
	return function(req,res){
			req.checkBody('password','Password is required').notEmpty()
			req.checkBody('userName','E-mail is not valid').isEmail()
			var errors = req.validationErrors();
			if(errors){
				res.render('login',{
					errors:errors
				});
			} 
				
		else{
		axios({
			method: 'PUT',
			url: 'https://'+ url + '/users/'+ req.body.userName + '/auth',
			httpsAgent: new https.Agent({ 
   				 rejectUnauthorized: false
  			}),
			data: {
				pw: req.body.password
			}
		}).then(wsResponse => { 
			const result = wsResponse.data;
			console.log('result status is',result.status)
			if (result.status != "OK") {
				console.log('okokok')
				req.session.error = result.info;
				res.redirect('/login');
			} else {
				console.log('login dogru')
				req.session.email = req.body.userName;
				req.session.authToken = result.authToken;
				res.redirect('/account');
			}
		}).catch(error => {
			console.log('catch icinde')
			console.log(error)
			if (error.response) {
				req.session.error = error.response.data.info;
			}
			res.redirect('/login');
		})
	}

	} 
}


function logout(app) {
	return function(req,res){
		req.session.destroy();
		res.redirect('/login');
	}
}

function serve(options) {
  
  //console.log("port is ", port);
  //console.log("url is", url);
  const port=options.port;
  const url=options.ws_url;
  const sslDir=options.sslDir
  const app = express();
  console.log("port is ", port);
  console.log("url is", url)
  console.log("ssldir is",sslDir)
  app.locals.port = port;
 // app.loacls.authTimeout=authTimeout;
  setupRoutes(app,url);
  https.createServer({
  	key: fs.readFileSync(`${options.sslDir}/key.pem`),
  	cert: fs.readFileSync(`${options.sslDir}/cert.pem`),
  }, app).listen(port,function(){
	console.log("listening on port = ", port);
       //console.log('listening on port ${port}');
  });  


  /*app.listen(port, function(){
  	console.log("listening on port = ", port);
  }); */
  
}


module.exports = {
  serve: serve
}







// Start Server
/*app.listen(80, function(){
  console.log('Server started on port 80...');
  setupRoutes(app)
}); */ 


/* http.createServer({
  	key: fs.readFileSync('./key.pem'),
  	cert: fs.readFileSync('./cert.pem'),
  }, app).listen(80,function(){
	console.log("listening on port = ", 80);
       //console.log('listening on port ${port}');
  });  
*/


