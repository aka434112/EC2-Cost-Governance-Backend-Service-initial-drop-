module.exports = function (accessId, secretKey, aliasName, email, budgetRestrictions) {
    this.accessId = accessId;
    this.secretKey = secretKey;
    this.aliasName = aliasName;
    this.email = email

    this.getAccessId = function () {
        return this.accessId;
    }

    this.getSecretKey = function () {
        return this.secretKey
    }

    this.getAliasName = function () {
        return this.aliasName
    }

    this.budgets = budgetRestrictions

    this.returnCredentialsAsObj = function () {
        return {
            "accessId": this.accessId,
            "secretKey": this.secretKey,
            "email": this.email,
            "aliasName": this.aliasName,
            "budgets": this.budgets
        }
    }
}