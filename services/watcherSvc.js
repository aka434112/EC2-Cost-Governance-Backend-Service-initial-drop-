const alarms = require('./alarmSvc')
const awsSvc = require('./awsSvc')
const AWS = require('../utils/awsUtil')

function watchCosts (credentials) {
    console.log("Running a cost check...");
    const budgetRestrictions = credentials["budgets"]
    const accessId = credentials['accessId']
    const secretKey = credentials['secretKey']
    const emailId = credentials['email']
    if (budgetRestrictions) {
        budgetsList = budgetRestrictions["budgetsList"]
        budgetsList.sort(function(a, b){return parseInt(b) - parseInt(a)})
        AWS.updateAwsAccessKeyId(accessId)
        AWS.updateAwsSecretAccessKey(secretKey)
        AWS.updateAwsRegion("us-east-1")
        const costExplorer = AWS.createNewCostExplorerObj()
        awsSvc.getCostCurrentMonth(costExplorer).then(currentCost => {
            for (let i = 0; i < budgetsList.length; i++) {
                let budgetRestriction = budgetsList[i]
                if(parseInt(currentCost) > parseInt(budgetRestriction)) {
                    alarms.triggerCostAlarm(budgetRestrictions[budgetRestriction], accessId, secretKey, emailId);
                    break;
                }
            }
        })
    }
}

module.exports = {
    "watchCosts" : watchCosts,
}