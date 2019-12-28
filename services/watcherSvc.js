const alarms = require('./alarmSvc');
const awsSvc = require('./awsSvc');
const AWS = require('../utils/awsUtil');
const databaseSvc = require('../services/rest/databaseSvc');
const credentialsObjKeys = require('../constants/credentialsObjKeys');

async function watchCosts (accessId) {
    console.log("Running a cost check against the IAM user account with the access ID: " + accessId);
    const credentials = await databaseSvc.getAccountDetail(accessId);
    if(!credentials) {
        return null;
    }
    const budgetRestrictions = credentials[credentialsObjKeys.ACCOUNT_BUDGETS_KEY];
    const secretKey = credentials[credentialsObjKeys.ACCOUNT_SECRET_KEY];
    const emailId = credentials[credentialsObjKeys.ACCOUNT_EMAIL_KEY];
    if (budgetRestrictions) {
        budgetsList = budgetRestrictions[credentialsObjKeys.ACCOUNT_BUDGETS_LIST_KEY];
        budgetsList.sort(function(a, b){return parseInt(b) - parseInt(a)});
        AWS.updateAwsAccessKeyId(accessId);
        AWS.updateAwsSecretAccessKey(secretKey);
        AWS.updateAwsRegion("us-east-1");
        const costExplorer = AWS.createNewCostExplorerObj();
        awsSvc.getCostCurrentMonth(costExplorer).then(currentCost => {
            for (let i = 0; i < budgetsList.length; i++) {
                let budgetRestriction = budgetsList[i];
                if(parseInt(currentCost) > parseInt(budgetRestriction)) {
                    alarms.triggerCostAlarm(budgetRestrictions[budgetRestriction], accessId, secretKey, emailId);
                    break;
                }
            }
        })
    }
    return true;
}

module.exports = {
    "watchCosts" : watchCosts,
}