## Instructions
* Make sure brew, node and PostgreSQL are installed 
* Clone the repo
* Ensure PostgreSQL is started by running 
```
brew services restart postgresql
```
* Install Sequelize CLI by running 
```
npm install -g sequelize-cli
```
* If postgres as a role is not created yet, do the following:
  - Enter PostgreSQL command line by typing:
  ```
  psql postgres
  ```
  - Create role by typing
  ```
  CREATE ROLE postgres WITH LOGIN PASSWORD ‘{YOUR_PASSWORD}’;
  ```
  - Give role permission to create database by typing
  ```
  ALTER ROLE postgres CREATEDB;
  ```
* Install all dependencies by typing
```
npm install
```
* Create database by typing: 
```
sequelize db:create
```
* Start app by typing
```
node app
```
