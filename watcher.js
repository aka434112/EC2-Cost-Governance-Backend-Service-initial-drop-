var fetch = require('isomorphic-fetch');
var watchers = require("./services/watcherSvc");
const databaseSvc = require("./services/rest/databaseSvc");

let watchInterval = 1000 * 6000; // By default, the watcher is going to run a scan every 24 hours unless it's explicitly specified by the user (feature not implemented yet)

// The watcher for cost limits

let awsAccounts;
let watchersList = {};


async function checkAccounts() {
    console.log("fetching accounts...");
    try {
        awsAccounts = await databaseSvc.getAccountDetails();
        if(awsAccounts) {
            awsAccounts.forEach(account => {
                let watcherId
                if (!watchersList[account["accessId"]]) {
                    console.log("Adding a watcher for the account: " + account["accessId"])
                    watcherId = setInterval(function () { watchers.watchCosts(account) }, watchInterval)
                    watchersList[account["accessId"]] = watcherId
                }
            })
        }
    } catch (e) {
        console.log(e.stack)
    }
}

setInterval(checkAccounts, 10000)