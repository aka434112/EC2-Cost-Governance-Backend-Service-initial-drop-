const httpSvc = require('./awsAccountsClient');

module.exports = {
    postAccountDetails: (docId, requestBody) => {
        return httpSvc.post('/' + docId, requestBody);
    },
    getAccountDetails: async () => {
        const awsAccountsWrapper = await httpSvc.get('/_search');
        const awsAccounts = awsAccountsWrapper.data.hits.hits.map(searchResult => searchResult["_source"]);
        return awsAccounts;
    }
}