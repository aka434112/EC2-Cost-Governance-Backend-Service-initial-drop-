const httpSvc = require('./awsAccountsClient');

module.exports = {
    postAccountDetails: (docId, requestBody) => {
        return httpSvc.post('/' + docId, requestBody);
    },
    getAccountDetails: async () => {
        const response = await httpSvc.get('/_search');
        const awsAccounts = response.data.hits.hits.map(searchResult => searchResult["_source"]);
        return awsAccounts;
    },
    getAccountDetail: async (accessId) => {
        const response = await httpSvc.get('/_doc/' + accessId);
        if(response.data.found){
            const awsAccount = response.data['_source'];
            return awsAccount;
        } else {
            return null;
        }
    }
}