var urlSvc = require('../utils/dbUrlConstructor');
var fetch = require('isomorphic-fetch');

let awsAccounts;

module.exports = {
    "postDetails": function (urlArr, requestBody, res) {
        let requestUrl = urlSvc.stitch(urlArr, "POST")
        fetch(requestUrl, {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {'Content-Type': 'application/json' }
        }).then(response => {
            res.status(201).send();
            return response.json();
        })
    },
    "getDetails": async function (urlArr) {
        let requestUrl = urlSvc.stitch(urlArr, "GET");
        let accounts = await fetch(requestUrl, {
            mode: "no-cors",
            headers: {'Content-Type': 'application/json' },
        })
        if (accounts.status === 200) {
            accounts = await accounts.json()
            accounts = accounts.hits.hits.map(searchResult => searchResult["_source"]);
            return accounts;
        }
    }
}