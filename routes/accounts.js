const express = require('express');
const router = express.Router();
const databaseSvc = require("../services/rest/databaseSvc");


router.post('/credentials/AWS/postAccount', async function(req, res) {
    if(req.body.credentials){
        const credentialsObj = req.body.credentials;
        const transactionData = await databaseSvc.postAccountDetails(credentialsObj.accessId, credentialsObj);
        res.status(transactionData.status).send(transactionData.statusText);
    } else {
        res.status(400).send("The request is missing the required credentials");
    }
})

router.get('/credentials/AWS/getAccounts', async function(req, res){
    const awsAccounts = await databaseSvc.getAccountDetails()
    res.send(awsAccounts);
})

router.post('/credentials/AWS/postListOfInstances', async function (req, res) {
    const accessId = req.body.accessId;
    const listOfEc2Instances = req.body.instancesList;
    const response = await databaseSvc.saveInstances(accessId, listOfEc2Instances);
    res.status(response.status).send();
})

module.exports = router;