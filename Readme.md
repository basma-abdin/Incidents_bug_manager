# Incidents and Bug manager

Content of this project.

   - Backend (Nodejs and ExpressJs)
   - Frontend (Angular)

# Description
create your team, category and issues, you can add members on your team, (like jira)
# Installation
You must install:
   - Nodejs
   - Angular cli
# Prerequisites
  We use an online database at https://www.mongodb.com/cloud.
The server will automatically connect to our database.

# Launch
backend:
```Sh
$ cd backend
$ npm install
$ npm start
```
frontend:
```Sh
$ cd frontend
$ npm install
$ ng serve
```
On your browser:
   - you enter on 'localhost: 4200 /'
# Documentation
- you enter on 'localhost: 3000 / docs'

# test scenario
  - register on the site, keep your (id and token)
  - create a team, keep the team id (_id)
  - add candidates (members) on your team, use the request '/ users /' to know the list of users
  - create a category, keep the category id (_id)
  - create issues in the category
  - add comments on the issues.
