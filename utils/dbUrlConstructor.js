const baseUrl = 'http://localhost:9200/'

module.exports = {
    "stitch": function (urlComponentsArr, reqType) {
        if (reqType === "POST") {
            return baseUrl + urlComponentsArr[0] + "/_doc/" + urlComponentsArr[1]; //stitching an URL for making a POST request to elasticsearch
        } else if (reqType === "GET" && urlComponentsArr.length === 1) {
            return baseUrl + urlComponentsArr[0] + "/_search"; //stitching an URL for making a GET request to elasticsearch (DSL excluded)
        }
        
    }
}