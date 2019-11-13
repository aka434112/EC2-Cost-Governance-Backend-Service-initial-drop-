var databaseSvc = require('./dbSvc');

function postAccount (credsObj, res) {
    return databaseSvc.postDetails(["awsaccounts", credsObj.getAccessId()], credsObj.returnCredentialsAsObj(), res);
}

function getAccount (accessId) {
    return databaseSvc.getAccount(["awsaccounts", accessId]);
}

async function getAccounts () {
    const awsAccounts = await databaseSvc.getDetails(["awsaccounts"])
    return awsAccounts
}

module.exports = {
    "saveAccount": postAccount,
    "fetchAccounts": getAccounts
}