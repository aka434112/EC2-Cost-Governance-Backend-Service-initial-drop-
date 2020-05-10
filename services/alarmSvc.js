const executeAction = require("../constants/actionConstants")
const AWS = require('../utils/awsUtil')
const awsSvc = require('./awsSvc')
const nodemailer = require('nodemailer')


let transporter = nodemailer.createTransport({
    service: 'gmail',
    proxy: 'http://web-proxy.in.softwaregrp.net:8080',
    auth: {
      user: '',
      pass: ''
    }
  })

let mailOptions = {
    from: 'ajithsjce@gmail.com'
}

function triggerCostControl (action, accessId, secretKey, emailId) {
    console.log("Triggering action '" + action + "'")
    AWS.updateAwsAccessKeyId(accessId)
    AWS.updateAwsSecretAccessKey(secretKey)
    mailOptions.to = emailId
    const actionToEvaluate = executeAction[action] + "('" + emailId + "')"
    eval(actionToEvaluate)
}

async function stopEc2Instances (emailId) {
    let ec2 = AWS.createNewEC2Obj()
    let awsEc2Regions = await awsSvc.getEc2Regions(ec2)
    for (let region of awsEc2Regions) {
        AWS.updateAwsRegion(region.RegionName)
        ec2 = AWS.createNewEC2Obj()
        const ec2Data = await ec2.describeInstances({}).promise()
        ec2Data["Reservations"].forEach(function(instanceObj){
            instanceObj.Instances.forEach(function(Instance){
                awsSvc.stopEc2Instances(Instance.InstanceId, ec2)
            })
        })
    }
    console.log("Now sending an email to " + emailId)
    mailOptions.subject = "Your AWS spend has exceeded the limit set by you!"
    mailOptions.text = "Your AWS spend has exceeded the budget limit that you had earlier setup in the Cost Governance Dashboard. All your active EC2 instances are now going to be stopped to make sure that you do not incur additional costs."
    sendAnEmail()
}

async function terminateEc2Instances (emailId) {
    let ec2 = AWS.createNewEC2Obj()
    let awsEc2Regions = await awsSvc.getEc2Regions(ec2)
    for (let region of awsEc2Regions) {
        AWS.updateAwsRegion(region.RegionName)
        ec2 = AWS.createNewEC2Obj()
        const ec2Data = await ec2.describeInstances({}).promise()
        ec2Data["Reservations"].forEach(function(instanceObj){
            instanceObj.Instances.forEach(function(Instance){
                awsSvc.terminateEc2Instances(Instance.InstanceId, ec2)
            })
        }) 
    }
    console.log("Now sending an email to " + emailId)
    mailOptions.subject = "Your AWS spend has exceeded the limit set by you!"
    mailOptions.text = "Your AWS spend has exceeded the budget limit that you had earlier setup in the Cost Governance Dashboard. All your active EC2 instances are now going to be terminated to make sure that you do not incur additional costs."
    sendAnEmail()
}

async function sendAnEmail (emailId) {
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    })
}

module.exports = {
    "triggerCostAlarm": triggerCostControl
}
