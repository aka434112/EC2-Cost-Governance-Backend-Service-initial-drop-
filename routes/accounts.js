const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const accountSvc = require("../services/accountsSvc");

const creds = require("../models/credentials");

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(process.env.PORT || 3000, ()=> {
    console.log("Server is up");
});


app.post('/credentials/AWS/postAccount', function(req, res) {
    if(req.body.credentials){
        const credsObj = new creds(req.body.credentials.accessId, req.body.credentials.secretKey, req.body.credentials.aliasName, req.body.credentials.email, req.body.credentials.budgets);
        accountSvc.saveAccount(credsObj, res);
    } else {
        res.status(400).send();
    }
})

app.get('/credentials/AWS/getAccounts', function(req, res){
    accountSvc.fetchAccounts().then(awsAccounts => {
        res.send(awsAccounts)
    })
})

require('./awsApiLayer')(app);

