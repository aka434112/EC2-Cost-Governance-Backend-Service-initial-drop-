const awsSvc = require('../services/awsSvc');

module.exports = function (app) {
    app.post('/api/v1/ec2Instances', function(req, res){
        AWS = awsSvc.validateIfAwsCredsPresent(req.body, res);
        awsSvc.fetchEc2InstancesAcrossRegions().then(instancesAcrossRegions => {
            res.send(instancesAcrossRegions)
        })
    })

    app.post('/api/v1/ec2Instances/cost/getCostPattern', function (req, res) {
        AWS = awsSvc.validateIfAwsCredsPresent(req.body, res);
        awsSvc.getCostPattern().then(costPattern => {
            res.send(costPattern)
        })
    })
    
    app.post('/api/v1/ec2Instances/cost/getCostCurrentMonth', function (req, res) {
        awsSvc.validateIfAwsCredsPresent(req.body, res)
        awsSvc.getCostCurrentMonth().then(cost => {
            res.send(cost)
        })
    })
}