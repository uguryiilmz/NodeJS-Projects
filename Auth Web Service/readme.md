Aims of This Project
The aims of this project are as follows:

To build a authentication web-service.

To develop and apply authentication protocols.

Specifications
Write a command-line nodejs program which is invoked as:

 ./index.js [ -t|--auth-time AUTH_TIME ] [ -d|--ssl-dir SSL_DIR ] PORT
and results in a web server listening for HTTPS requests on port PORT. The program takes the following options:

-t | --auth-time
The time in seconds before an authentication token times out. If not specified, the value should default to 300 seconds.

-d | --ssl-dir
The path to the directory containing SSL credential files key.pem and cert.pem. If not specified, the value should default to the directory from which the server was started.


The program should provide an authentication web service. Specifically, the web server should respond to the following relative URL's (relative to the base url of scheme, hostname and port) and HTTP methods:

PUT /users/ID?pw=PASSWORD
The request must have a body which must be a JSON object. If the request is successful then it must store the entire JSON object so that it can be retrieved by the ID part of the URL after specifying the password PASSWORD.

If there was a previously created user for ID, then the server should return a status 303 SEE_OTHER with the Location header set to the absolute URL for /users/ID. It should return a body:

        { "status": "EXISTS",
	  "info": "user <ID> already exists"
	}
with <ID> replaced by the ID in the request URL.

If there was no previously created user for ID, then the server must create a user for ID set to the JSON object and return a 201 CREATED status code, with Location header set to the absolute URL for /users/ID and with a JSON body set to:

      { "status": "CREATED",
        "authToken":` "<authToken>", 
      }
where <authToken> is a random authentication token (see below).

PUT /users/ID/auth
with a JSON body which must be of the form {"pw": PASSWORD }.

If there was a previously created user for ID with password PASSWORD, then the server should return a status 200 OK with a response body:

      { "status": "OK",
        "authToken":` "<authToken>", 
      }
where <authToken> is a random authentication token (see below).

If the user specified by ID is not found, then the server must return a 404 NOT FOUND status code with a response body:

        { "status": "ERROR_NOT_FOUND",
	  "info": "user <ID> not found"
	}
with <ID> replaced by the ID in the request URL.

If the pw parameter is not present in the request body, or the PASSWORD is not correct, then the server must return a 401 UNAUTHORIZED response with a response body:

        { "status": "ERROR_UNAUTHORIZED",
	  "info": "/users/<ID>/auth requires a valid 'pw' password query parameter"
	}
with <ID> replaced by the ID in the request URL.

GET /users/ID
The request must have a Authorization: Bearer <authToken> header (case insensitive) where <authToken> is a currently valid authentication token.

If everything is valid, then this request should return a JSON of the information previously stored under ID when created using the PUT request.

If the user specified by ID is not found, then the server must return a 404 NOT FOUND status code with a response body:

        { "status": "ERROR_NOT_FOUND",
	  "info": "user <ID> not found"
	}
with <ID> replaced by the ID in the request URL.

NOTE:HTTPS server should be created to make the project work.

To setup the https server, you will need to generate a certificate.
$ openssl req -nodes -x509 -newkey rsa:2048 \
          -keyout key.pem -out cert.pem -days 100
