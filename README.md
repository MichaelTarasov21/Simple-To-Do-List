# To-Do-List
A simple to-do list program that I am making as an entry point into backend development

Initial Setup:
```
npm i
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
```
Note on hashstrength:
Larger values slow down hash computation but improves the randomness of salt.
A good default is 12
