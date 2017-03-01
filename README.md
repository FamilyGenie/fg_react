# Instructions to run
#### Development Environment
In the root repository folder run these commands in order

Make sure that the API server is running (instructions in repo)
<a href='https://github.com/FamilyGenie/fg_apiserver'>fg-apiserver</a>

1. `npm install`
2. `npm run dev`

Current default development url is `http://localhost:8080`

On the Login page, you will need credentials which will be provided with the database dump file.
When logging in currently there is a bug, but it has an easy work around.
When entering the credentials you will need to follow these steps:

* enter the username and password, making sure to blur out of both fields.
* click login
* go back to the login page
* re-enter the credentials, again blur out of both fields
* login again.

The database data should automatically appear on the family list page
