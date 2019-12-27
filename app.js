require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const accounts = require('./routes/accounts');
const awsInteractionLayer = require('./routes/awsApiLayer');

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', accounts);
app.use('/', awsInteractionLayer)

app.listen(process.env.PORT || 3000, ()=> {
    console.log("Server is up");
});

require('./watcher');