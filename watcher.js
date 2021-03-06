var fetch = require('isomorphic-fetch');
var watchers = require("./services/watcherSvc");
const databaseSvc = require("./services/rest/databaseSvc");
const credentialsObjKeys = require('./constants/credentialsObjKeys');

// The watcher for cost limits

let awsAccounts;
let watchersList = {};


async function checkAccounts() {
    console.log("fetching accounts...");
    try {
        awsAccounts = await databaseSvc.getAccountDetails();
        if(awsAccounts) {
            awsAccounts.forEach(account => {
                let watcherId;
                let accessId = account[credentialsObjKeys.ACCOUNT_ACCESS_ID_KEY];
                if (!watchersList[accessId]) {
                    console.log("Adding a watcher for the IAM user with the access ID: " + accessId);
                    watcherId = setInterval(function () { 
                        let accountActive = watchers.watchCosts(accessId);
                        if(!accountActive){
                            console.log("An account associated with the IAM user with the access ID " + accessId + " no longer exists...");
                            clearInterval(watchersList[accessId]);
                            delete watchersList[accessId];
                        }
                    }, account[credentialsObjKeys.ACCOUNT_POLLING_INTERVAL]);
                    watchersList[accessId] = watcherId;
                }
            })
        }
    } catch (e) {
        console.log(e.stack);
    }
}

setInterval(checkAccounts, 10000)