

const { timeslotDateLevelService, timeslotTimeLevelService, entityService } = require('../dataservice')
const _ = require('lodash')
const { dynamodbClient } = require('../awsInstance')
const objectPath = require('object-path')
const TABLE_TIME = "Q_Timeslot_Time_Level"
const TABLE_DATE = "Q_Timeslot_Date_Level"
const { getTodayYYYY_MM_DD } = require('../utils')
const { success } = require('../utils/http_response')


// ดูทุกหน่วยงานตามวันที่
module.exports.list = async (event) => {

    let { date } = event.queryStringParameters || {};
    let _date = date || new Date().toISOString().substring(0, 10);
    // _date = _date.replace("_","-")

    //QUERY
    var params = {
        TableName: 'Q_Timeslot_Date_Level',
        IndexName: 'date-index',
        KeyConditionExpression: '#date = :date',
        ExpressionAttributeNames: {
            "#date": "date"
        },
        ExpressionAttributeValues: {
            ":date": _date
        }
    };
    var lasyKey = null;
    var res = [];
    do {
        lasyKey ? (params.ExclusiveStartKey = lasyKey) : null;
        var data = await dynamodbClient.query(params)
        res = res.concat(data.Items);
        lasyKey = data.LastEvaluatedKey;
    } while (data.LastEvaluatedKey);

    //compute


    //COMPUTE
    let entitys = {}
    for (let index = 0; index < res.length; index++) {
        const element = res[index];
        let { date, entityId, open, reserve } = element;
        if (entitys[entityId] == undefined) {
            entitys[entityId] = {
                open: 0,
                reserve: 0
            }
        }

        for (const attr in element) {
            if (attr.indexOf('.open') >= 0) {
                entitys[entityId]['open'] += element[attr];
            }
            if (attr.indexOf('.reserve') >= 0) {
                entitys[entityId]['reserve'] += element[attr];
            }
        }


    }


    //compute AVALIABLE
    _.forEach(entitys, (obj, entityId) => {
        obj.available = obj.open - obj.reserve;
    })
    return success(entitys, { cache: process.env.CACHE })

}


// ดูของหนึ่งหน่วยงาน ตาราง timeslot ของวันนั้นๆ
module.exports.get = async (event) => {



    let { entity, date } = event.pathParameters
    let res = await timeslotDateLevelService.get(entity, date)


    let object = res.Item || null
    let obj = {}
    for (const attr in object) {
        objectPath.set(obj, attr, object[attr])
    }

    // console.log(obj)

    // ถ้าไม่มีค่าให้ return null แทน
    let res1 = null
    if (!_.isEmpty(obj)) {
        res1 = obj
    }


    return success(res1, { cache: 7 })


};



// ดูของหนึ่งหน่วยงาน ภาพรวมวัน
module.exports.getQuery = async (event) => {



    let { entity } = event.pathParameters

    //fetch
    var params = {
        TableName: 'Q_Timeslot_Date_Level',
        KeyConditionExpression: 'entityId = :hkey',
        ExpressionAttributeValues: {
            ':hkey': entity,
        }
    };
    var lasyKey = null;
    var res = [];
    do {
        lasyKey ? (params.ExclusiveStartKey = lasyKey) : null;
        var data = await dynamodbClient.query(params)
        res = res.concat(data.Items);
        lasyKey = data.LastEvaluatedKey;
    } while (data.LastEvaluatedKey);


    //COMPTE ALL DATES
    let dataRes = {}
    for (let index = 0; index < res.length; index++) {
        const dataDateLevel = res[index];
        let { date } = dataDateLevel
        dataRes[date] = {
            open: 0,
            reserve: 0,
            active: _.get(dataDateLevel, 'active', true),
            today: getTodayYYYY_MM_DD() == date || false
        }
        for (const attr in dataDateLevel) {
            if (attr.indexOf('.open') >= 0) {
                dataRes[date]['open'] += dataDateLevel[attr];
            }
            if (attr.indexOf('.reserve') >= 0) {
                dataRes[date]['reserve'] += dataDateLevel[attr];
            }
        }
    }

    // กรองวันในอดีตออก และ กรอกวันที่ ไม่มี open เลยออก
    let today = getTodayYYYY_MM_DD()
    dataRes = _.reduce(dataRes, (acc, d, date) => {

        if (d.open >= 1 && date >= today) {
            acc[date] = d
        }
        return acc
    }, {})

    return success(dataRes, { cache: process.env.CACHE })



};


module.exports.post = async (event) => {

    console.log(event)

    let data = JSON.parse(event.body)
    let { entityId, dateList, timeslots } = data

    //  let res = await timeslotService.get('entityId', `${entityId}:`)

    // TIME_LEVEL
    let promiseList2 = []
    for (var index2 = 0; index2 < dateList.length; index2++) {
        var date2 = dateList[index2];


        _.forEach(timeslots, (v, keyTime) => {
            let d = {
                entity_date_time: `${entityId}:${date2}:${keyTime}`,
                entityId: entityId,
                date: date2,
                open: v,
                reserve: 0
            }

            let p = timeslotTimeLevelService.update(d.entity_date_time, d)
            promiseList2.push(p)
        });

    }
    await Promise.all(promiseList2)

    return success({ status: "ok" })


};


module.exports.put = async (event) => {


    // console.log(event)

    let data = JSON.parse(event.body)
    let { entityId, date, time, value, action } = data
    let hashKey = `${entityId}:${date}:${time}`
    switch (action) {
        case "insert":
            await _insertTimeslot(entityId, date, time, value)
            break;

        case "open":
            await _openValueCmd(hashKey, value)
            break;
        case "remove":

            await _removeCmd(hashKey)
            break;
        case "active":
            await _dateActiveCmd(entityId, date, value)
            break;
        default:
            break;
    }
    return success({ status: "ok" })


};


function _insertTimeslot(entityId, date, time, value) {

    let d = {
        entity_date_time: `${entityId}:${date}:${time}`,
        entityId: entityId,
        date: date,
        open: value || 0,
        reserve: 0
    }
    var params = {
        TableName: TABLE_TIME,
        Item: d
    };
    return dynamodbClient.put(params)
}
function _openValueCmd(hashKey, openValue) {
    var params = {
        TableName: TABLE_TIME,
        Key: { "entity_date_time": hashKey },
        UpdateExpression: 'set #open = :x ',
        ConditionExpression: '#reserve <= :x',
        ExpressionAttributeNames: {
            '#open': 'open',
            '#reserve': 'reserve',
        },
        ExpressionAttributeValues: {
            ':x': openValue,

        }
    };
    return dynamodbClient.update(params)
}

function _dateActiveCmd(entityId, date, value = true) {

    var params = {
        TableName: TABLE_DATE,
        Key: { entityId, date },
        UpdateExpression: 'set #a= :value ',
        ExpressionAttributeNames: {
            '#a': `active`,
        },
        ExpressionAttributeValues: {
            ':value': value,

        }
    };
    return dynamodbClient.update(params)
}


function _removeCmd(hashKey) {
    var params = {
        TableName: TABLE_TIME,
        Key: {
            "entity_date_time": hashKey
        },
        ConditionExpression: '#reserve = :reserve',
        ExpressionAttributeNames: {
            '#reserve': 'reserve'
        },
        ExpressionAttributeValues: {
            ':reserve': 0,
        }
    };
    return dynamodbClient.delete(params)
}


