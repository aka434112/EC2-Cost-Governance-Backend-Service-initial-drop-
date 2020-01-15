const axios = require('axios');

const httpSvc = axios.create({
    baseURL: process.env.ES_EC2_INSTANCES_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

module.exports = httpSvc