

The project works with the following command for example 
sudo ./index.js 80 35.196.40.69:443 when the other server is started on 443 port. Pug template is used for html pages. It handles the login, register and account pages by using both backend and front-end (nodejs, pug template)

Aims of This Project
The aims of this project are as follows:

To build a authentication web application which uses a authentication web service.

To generate HTML on the server.

Specifications
Set up your gitlab project so that it contains a web-auth subdirectory within the top level submit directory. Cloning your project, setting the current directory to your web-auth subdirectory and then running npm install followed by

 ./index.js [ -d|--ssl-dir SSL_DIR ] PORT WS_URL
should result in a web server listening for HTTPS requests on local port PORT.

Our web server must act as a front-end for a web-service running on the URL specified by WS_URL which meets the specifications for authProject in my github.

