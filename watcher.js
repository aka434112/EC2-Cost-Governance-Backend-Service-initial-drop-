var fetch = require('isomorphic-fetch');
var watchers = require("./services/watcherSvc");
const accountSvc = require("./services/accountsSvc");

let watchInterval = 1000 * 6000; // By default, the watcher is going to run a scan every 24 hours unless it's explicitly specified by the user (feature not implemented yet)

// The watcher for cost limits

let awsAccounts;
let watchersList = {};
let oldAccessIds = [];


async function checkAccounts() {
    console.log("fetching accounts...");
    awsAccounts = await accountSvc.fetchAccounts();
    if(awsAccounts) {
        awsAccounts.forEach(account => {
            let watcherId
            if (!watchersList[account["accessId"]]) {
                console.log("Adding a watcher for the account: " + account["accessId"])
                watcherId = setInterval(function () { watchers.watchCosts(account) }, watchInterval)
                watchersList[account["accessId"]] = watcherId
                oldAccessIds.push(account["accessId"])
            }
        })
    }

}

setInterval(checkAccounts, 10000)