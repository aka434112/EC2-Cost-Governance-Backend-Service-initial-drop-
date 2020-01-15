const accountsClient = require('./awsAccountsClient');
const instancesClient = require('./ec2Client');

module.exports = {
    postAccountDetails: (docId, requestBody) => {
        return accountsClient.post('/_doc/' + docId, requestBody);
    },
    getAccountDetails: async () => {
        const response = await accountsClient.get('/_search');
        const awsAccounts = response.data.hits.hits.map(searchResult => searchResult["_source"]);
        return awsAccounts;
    },
    getAccountDetail: async (accessId) => {
        const response = await accountsClient.get('/_doc/' + accessId);
        if(response.data.found){
            const awsAccount = response.data['_source'];
            return awsAccount;
        } else {
            return null;
        }
    },
    saveInstances: (accessId, listOfInstances) => instancesClient.post('/_doc/' + accessId, {listOfInstances})
}
