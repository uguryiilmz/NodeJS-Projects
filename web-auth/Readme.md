

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


 Requirements :
 
The program should provide an authentication web application with the following web pages:

Login
The login page must provide the following suitably labelled input controls:

An input field for an email address.

An input field for a password.

A Login submit button.

A link to the Registration page.

When the page is submitted using the Login button, the program should validate the input fields:

None of the input fields should be empty.

The email address should look like a reasonable email address.

If the validation succeeds, the program should use the login web service at WS_URL to set up a login session for the browser which submitted the request and display the Account page in the browser.

If either the login web service or the validation fails, the program should redisplay the login page with suitable error messages. All user input except for the password should be retained; the password field should be cleared out.

Registration
The registration page must provide the following suitably labelled input controls:

An input field for a first name.

An input field for a last name.

An input field for an email address.

An input field for a password.

An input field for password confirmation.

A Register submit button.

A link to the Login page.

When the page is submitted using the Login button, the program should validate the input fields:

None of the input fields should be empty.

The email address should look like a reasonable email address.

The password should consist of at least 8 characters none of which is a whitespace character and at least one of which is a digit.

The value for the password confirmation field must match the password field.

If the validation succeeds, the program should use the registration web service at WS_URL to create a registration corresponding to the submitted information and set up a login session for the browser which submitted the request and display the Account page in the browser.

If either the registration web service or the validation fails, the program should redisplay the registration page with suitable error messages. All user input except for the password fields should be retained; the password fields should be cleared out.

Account
The account page should display suitably labelled first name and last name from the registration corresponding to the current login session.

It should also contain a Logout button such that clicking that button terminates the current login session and displays the Login page.

You may choose any URLs for the above pages. You are required to support a / URL such that:

Any attempt to access / using a browser which does not have a valid login session will result in display of the Login page.

Any attempt to access / using a browser which has a valid login session will result in display of the Account page.

Any attempt to access the URL chosen for the Account page should result in a display of the Login page if there is no valid login session.

Your web application must meet the following additional requirements:

All requests should use https.

Leading and trailing whitespace should be ignored for all input fields.

A reasonable email address must look like user@domain where user and domain can be arbitrary non-empty strings.
