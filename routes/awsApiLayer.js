const express = require('express');
const router = express.Router();

const awsSvc = require('../services/awsSvc');

router.post('/api/v1/aws/ec2Instances', function(req, res){
    AWS = awsSvc.validateIfAwsCredsPresent(req.body, res);
    awsSvc.fetchEc2InstancesAcrossRegions().then(instancesAcrossRegions => {
        res.send(instancesAcrossRegions)
    })
})

router.post('/api/v1/aws/ec2Instances/cost/getCostPattern', function (req, res) {
    AWS = awsSvc.validateIfAwsCredsPresent(req.body, res);
    awsSvc.getCostPattern().then(costPattern => {
        res.send(costPattern)
    })
})

router.post('/api/v1/aws/ec2Instances/cost/getCostCurrentMonth', function (req, res) {
    awsSvc.validateIfAwsCredsPresent(req.body, res)
    awsSvc.getCostCurrentMonth().then(cost => {
        res.send(cost)
    })
})

module.exports = router;