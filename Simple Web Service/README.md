Name : UGUR YILMAZ

B-number:B00581761

Notes:
For the id part, it should be a 24 character because I am changing the mongoid as an id. So,if you use put /post/delete/get/id request, the id should be
24 characters because of the reason that I did not want it to have 2 different id's. Therefore, I used objectID that is created by MongoDB. It  throw an error
if you type anything other than 24 characters.

Besides, I did not use the get method that is provided by sample code for my update method because of the reason that I had to find if that id  exist, I
had to use the get method but the sample code was throwing error when it does not. Thus, I implemented another getForUpdate method which is nearly same as
get method. The only difference is that it resolves 0 instead of an error. So, I can check in the server code that if the id is found , it is going to return
zero, then create a new user. Otherwise , it is going to update the current id's body.

All the methods (put/post/delete/get) works properly as it asked in the projec2 requirements.

I also inserted the nodes_module which I was not sure if we had to add that 