Name: Ugur Yilmaz
B Number:B00581761

When my code is being tested, the token expires after a specific period of time.After that, you need to login to get new token. When it is broken, you will see
token is expired, login again. it requires you to login again. If you send a get url and the token is not valid. Then you might need to login twice, because 
the  first one determines if the token is expired. Plus, I did not add any key.pem or cem.pem files because the professor told me grader would provide 
their own copies. Thanks
