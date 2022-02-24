# To-Do-List
A simple to-do list program that I am making as an entry point into backend development

Prerequistes:
```
NodeJS
A running MySQL database
```

Initial Setup:
```
npm i
npm run setup
```

To run:
```
npm start
```
.env:
```
PORT = Port_To_Run_On
SQLUSER = "sql_username"
SQLPASSWORD = "sql_password"
DATABASE = "database_name"
HASHSTRENGTH = 12
COOKIESECRET =  ""
```
Note on hashstrength:
Larger values slow down hash computation but improves the randomness of salt.
A good default is 12
