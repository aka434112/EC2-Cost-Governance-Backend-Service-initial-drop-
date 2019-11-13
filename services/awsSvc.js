const AWS = require('../utils/awsUtil');
const dateUtil = require('../utils/dateUtil');

function validateIfAwsCredsPresent (requestBody, res) {
    let accessId = requestBody.accessId;
    let secretKey = requestBody.secretKey;
    if(!accessId || !secretKey){
        console.error("The IAM user credentials aren't properly defined...");
        res.status(400).send();
        return;		
    }
    AWS.updateAwsAccessKeyId(accessId);
    AWS.updateAwsSecretAccessKey(secretKey);
    return AWS;
}

async function fetchEc2InstancesAcrossRegions () {
        // let instancesAcrossRegions = [];
        // let ec2 = AWS.createNewEC2Obj();
        // let params = {};
        // ec2.describeRegions(params, function(err, data) {
        //     if (err) {
        //         console.error(err);
        //         res.status(400).send();
        //         return;
        //     } // an error occurred
        //     else {
        //         let regionsCount = 0;
        //         const regions = data.Regions;
        //         regions.forEach(region => {
        //             let regionName = region.RegionName
        //             console.log(regionName);
        //             AWS.updateAwsRegion(regionName);
        //             ec2 = AWS.createNewEC2Obj();
        //             ec2.describeInstances(params, function(err, data) {
        //                 console.log("data fetched against region: " + regionName);
        //                 if (err) {
        //                     console.error(err);
        //                     res.status(400).send();
        //                     return;
        //                 } // an error occurred
        //                 else {
        //                     data["Reservations"].forEach(function(instance){
        //                         instance.Instances.forEach(function(Instance){
        //                             let obj = {};
        //                             obj.InstanceId = Instance.InstanceId;
        //                             obj.InstanceType = Instance.InstanceType;
        //                             obj.region = Instance.Placement.AvailabilityZone;
        //                             obj.status = {"code" : Instance.State.Code, "status": Instance.State.Name}
        //                             instancesAcrossRegions.push(obj);
        //                         })
        //                     });
        //                     regionsCount += 1
        //                     if (regionsCount === regions.length) {
        //                         res.send(instancesAcrossRegions);
        //                     }                     
        //                 }
        //             });
        //         })
        //     }            
        // })  Re-writing the code block above making use of async/await
    const params = {}
    const instancesAcrossRegions = []
    let ec2 = AWS.createNewEC2Obj();
    let regions = await getEc2Regions()
    let ec2DataPromises = []
    for (region of regions) {
        let regionName = region.RegionName
        AWS.updateAwsRegion(regionName);
        ec2 = AWS.createNewEC2Obj();
        ec2DataPromises.push(ec2.describeInstances(params).promise())
    }     
    let ec2DataAcrossRegions = await Promise.all(ec2DataPromises)
    ec2DataAcrossRegions.forEach(ec2Data => {
        ec2Data["Reservations"].forEach(function(instance){
            instance.Instances.forEach(function(Instance){
                let obj = {};
                obj.InstanceId = Instance.InstanceId;
                obj.InstanceType = Instance.InstanceType;
                obj.region = Instance.Placement.AvailabilityZone;
                obj.status = {"code" : Instance.State.Code, "status": Instance.State.Name}
                instancesAcrossRegions.push(obj);
            })
        })  
    })     
    return instancesAcrossRegions;
}

async function getEc2Regions (ec2ContextFromWatcher) {
    const params = {}
    let ec2 = AWS.createNewEC2Obj()
    if(ec2ContextFromWatcher) {
        ec2 = ec2ContextFromWatcher
    }
    const regionsData = await ec2.describeRegions(params).promise()
    return regionsData.Regions
}

async function getCostCurrentMonth(costExplorerContextFromWatcher) {
    AWS.updateAwsRegion("us-east-1")
    let costExplorer = AWS.createNewCostExplorerObj()
    const costParams = {
        TimePeriod: {
            End: dateUtil.getDate("today"), 
            Start: dateUtil.getDate("startOfCurrentMonth")
        },
        Granularity: 'MONTHLY',
        Metrics: ['BlendedCost']
    }
    if(costExplorerContextFromWatcher) {
        costExplorer = costExplorerContextFromWatcher
    }
    try {
        const costData = await costExplorer.getCostAndUsage(costParams).promise()
        let cost = costData.ResultsByTime[0].Total.BlendedCost
        return cost.Amount
    } catch (e) {
        console.log(e.name)
        console.log(e.message)
    }
}

async function getCostPattern() {
    AWS.updateAwsRegion("us-east-1")
    let costExplorer = AWS.createNewCostExplorerObj()
    let costPattern = {}
    const costParams = {
        TimePeriod: {
            End: dateUtil.getDate("today"), 
            Start: dateUtil.getDate("startOfMonth-6")
        },
        Granularity: 'MONTHLY',
        Metrics: ['BlendedCost']
    }
    let costData = await costExplorer.getCostAndUsage(costParams).promise()
    costData.ResultsByTime.forEach(timePeriod => {
        let monthIndex = parseInt(timePeriod.TimePeriod.Start.split('-')[1])
        let cost = timePeriod.Total.BlendedCost.Amount
        let month = dateUtil.getMonthFromIndex(monthIndex)
        costPattern[month] = cost;
    })
    return costPattern
}

async function stopEc2Instances (instanceIds, ec2ContextFromWatcher) {
    let ec2 = AWS.createNewEC2Obj()
    if(ec2ContextFromWatcher) {
        ec2 = ec2ContextFromWatcher
    }
    const params = {
        InstanceIds: [instanceIds]
       }
    const stats = await ec2.stopInstances(params).promise()
    return stats
}

async function terminateEc2Instances (instanceIds, ec2ContextFromWatcher) {
    let ec2 = AWS.createNewEC2Obj()
    if(ec2ContextFromWatcher) {
        ec2 = ec2ContextFromWatcher
    }
    const params = {
        InstanceIds: [instanceIds]
       }
    const stats = await ec2.terminateInstances(params).promise()
    return stats    
}

module.exports = {
    validateIfAwsCredsPresent,
    fetchEc2InstancesAcrossRegions,
    getCostCurrentMonth,
    getCostPattern,
    stopEc2Instances,
    terminateEc2Instances,
    getEc2Regions
}