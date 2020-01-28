const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv/config');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Incidents and Bugs Manager",
      version: "1.0.0",
      description:
        "This documentation shows you how to use the API of our project",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/"
      },
      contact: {
        name: "Swagger",
        url: "https://swagger.io",
        email: "Info@SmartBear.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1"
      }
    ]
  },
  apis: [
          "./models/User.js","./routes/users.js",
          "./models/Team.js","./routes/teams.js",
          "./models/Category.js","./routes/categories.js",
          "./models/Issue.js","./routes/issues.js",
          "./models/Issue.js", "./routes/comments.js"
        ]
};

var auth_options = {
  swaggerOptions: {
    authAction :{ authentication: {name: "authentication", schema: {type: "http", in: "header", name: "Authorization", description: ""}, value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGEyMjEyZmI3ZjVmNzU3ZjZmNzZmZjMiLCJpYXQiOjE1NzM1MDY1NTJ9.uBGfqvwILzwbu0hPcXOi--toVjblse88vXeE4YI980s"} }
  }
};

const swaggerDocs  = swaggerJsdoc(options);
// app.use("/docs", swaggerUi.serve);
app.use("/docs",swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    explorer: true
  })
);

// Import Routes
const issuesRoute = require('./routes/issues');
const usersRoute = require('./routes/users');
const teamsRoute = require('./routes/teams');

app.use('/api/v1/issues', issuesRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/teams', teamsRoute);



app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'auth-token,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  //res.setHeader('Access-Control-Allow-Credentials', false);

  next();
});


// const DB_CONNECTION= "mongodb+srv://readWriteUser:readwrite@cluster0-ro2rj.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(process.env.DB_CONNECTION,{
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to DB'));


app.listen(3000, () => console.log("Server is running"));