const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { dynamodbClient } = require('../awsInstance')

const { removeSpecialChars } = require('../utils')
const _ = require('lodash')
const TABLE_NAME_DATE_LEVEL = 'Q_Timeslot_Date_Level'

const INSTANCE_CREATE = new Date().toISOString()

module.exports.handler = async (event) => {


    // schema
    // let timeslot_DateLevel = {
    //     "1234:2021-10-10": {  //key
    //         "time.0000-0100.reserve": 200,   //attr,  value if -1 == remove
    //     }
    // }

    console.log("instance created at : " + INSTANCE_CREATE)
    let timeslot_DateLevel = {};


    let records = event.Records;
    for (let index = 0; index < records.length; index++) {
        const element = records[index];

        let isRemove = false
        if (element.eventName == "REMOVE") {
            isRemove = true;
        }
        let newImage = element.dynamodb.NewImage;
        let oldImage = element.dynamodb.OldImage;
        let data = unmarshall(newImage || oldImage);
        let { entity_date_time, open, reserve, lastUpdate } = data;
        let [entityId, date, time] = entity_date_time.split(':')

        let hash_key = `${entityId}:${date}`
        if (timeslot_DateLevel[hash_key] == undefined) {
            timeslot_DateLevel[hash_key] = {}
        }


        // RESERVE
        let reserve_key = `time.${time}.reserve`;
        if (timeslot_DateLevel[hash_key][reserve_key] == undefined) {
            timeslot_DateLevel[hash_key][reserve_key] = 0;
        }
        timeslot_DateLevel[hash_key][reserve_key] = reserve

        // OPEN
        let open_key = `time.${time}.open`;
        if (timeslot_DateLevel[hash_key][open_key] == undefined) {
            timeslot_DateLevel[hash_key][open_key] = 0;
        }
        timeslot_DateLevel[hash_key][open_key] = open

        if (isRemove) {
            timeslot_DateLevel[hash_key][open_key] = -1;
            timeslot_DateLevel[hash_key][reserve_key] = -1;
        }
    }


    //do update all
    let promiseList = []
    _.forEach(timeslot_DateLevel, (dataTimeObj, entity_date) => {

        let objFiltered1 = getOnlyValue(dataTimeObj, 'update')

        if (_.keys(objFiltered1).length == 0) {
            return
        }

        let updateExpression = _.reduce(objFiltered1, (acc, reserveAmount, timeKey) => {
            let str = removeSpecialChars(timeKey)
            acc.push(` #${str} = :${str} `)

            return acc
        }, [])

        let [entityId, date] = entity_date.split(':')
        var params = {
            TableName: TABLE_NAME_DATE_LEVEL,
            Key: {
                entityId: entityId,
                date: date
            },
            UpdateExpression: 'SET ' + updateExpression.join(','),
            ExpressionAttributeNames: _.reduce(objFiltered1, (acc, reserveAmount, timeKey) => {
                let str = removeSpecialChars(timeKey)
                acc[`#${str}`] = timeKey;
                return acc
            }, {}),
            ExpressionAttributeValues: _.reduce(objFiltered1, (acc, reserveAmount, timeKey) => {
                let str = removeSpecialChars(timeKey)
                acc[`:${str}`] = reserveAmount;
                return acc
            }, {}),
        };

        console.log(params)
        let p = dynamodbClient.update(params)
        promiseList.push(p)
    })


    await Promise.all(promiseList)



    //REMOVE
    let promiseList2 = []
    _.forEach(timeslot_DateLevel, (dataTimeObj, entity_date) => {

        let objFiltered2 = getOnlyValue(dataTimeObj, 'remove')

        if (_.keys(objFiltered2).length == 0) {
            return
        }
        let updateExpression = _.reduce(objFiltered2, (acc, reserveAmount, timeKey) => {
            let str = removeSpecialChars(timeKey)
            acc.push(`#${str} `)

            return acc
        }, [])
        let [entityId, date] = entity_date.split(':')

        var params = {
            TableName: TABLE_NAME_DATE_LEVEL,
            Key: {
                entityId,
                date
            },
            UpdateExpression: 'REMOVE ' + updateExpression.join(','),
            ExpressionAttributeNames: _.reduce(objFiltered2, (acc, reserveAmount, timeKey) => {
                let str = removeSpecialChars(timeKey)
                acc[`#${str}`] = timeKey;
                return acc
            }, {}),

        };
        // console.log(params)
        let p = dynamodbClient.update(params)
        promiseList2.push(p)
    })


    if (promiseList2.length >= 1) {
        await Promise.all(promiseList2)
    }

    return {
        status: 'ok'
    }
}


function getOnlyValue(dataHolder, type) {

    return _.reduce(dataHolder, (acc, value, key) => {

        if (type == 'update' && value >= 0) {
            acc[key] = value;
        }

        if (type == 'remove' && value == -1) {
            acc[key] = value;
        }

        return acc
    }, {})
}
