const { registerService, } = require('../dataservice')
const { dynamodbClient } = require('../awsInstance')
const _ = require('lodash')
const uuid = require('uuid')
const { getTodayYYYY_MM_DD } = require('../utils')
const moment = require('moment')
const TABLE_NAME = 'Q_Timeslot_Time_Level'
const TABLE_Register = 'Q_Register'
const { success, clientError } = require('../utils/http_response')

const ERROR_CASE = {
    TIMESLOT_FULL: "ConditionalCheckFailedException",
    ALREADY_REGISTER_IN_DATE: "ALREADY_REGISTER_IN_DATE"
}

let FULL_HOLDER = {
    // "1111:2021-10-12:1100-1300"  :true
}

module.exports.get = async (event) => {

    let { userId, } = event.pathParameters

    let { entityId } = event.queryStringParameters || {}
    var params = {
        TableName: TABLE_Register,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :hkey',
        ExpressionAttributeValues: {
            ':hkey': userId,
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

    if (entityId) {
        res = _.filter(res, r => r.entityId == entityId)
    }

    let today = getTodayYYYY_MM_DD()
    res = _.filter(res, r => r.date >= today)

    return success(res, { cache: 15 })

}



// create
module.exports.post = async (event) => {
    let genHashKey = null;

    try {


        let data = JSON.parse(event.body)

        const { reserveToken, entityId, date, time, idCardNumber } = data;


        // update slot first
        genHashKey = `${entityId}:${date}:${time}`;


        // Check is full
        if (FULL_HOLDER[genHashKey]) {
            throw {
                name: ERROR_CASE.TIMESLOT_FULL
            }
        }



        //PROCESS
        const registerId = `${entityId}:${date}:${idCardNumber}`;
        const registerCode = `${data.time.slice(0, 3)}` + _.random(100, 999).toString();

        // - ต้องยังไม่เคยสมัครวันนั้น หน่วยงานนั้น
        let getRes = await registerService.get(registerId)
        console.log(getRes)
        if (getRes.Item) {
            throw {
                name: ERROR_CASE.ALREADY_REGISTER_IN_DATE
            }
        }
        // - จองตัดยอดของวัน
        await updateInventory(genHashKey)

        // - บันทึกข้อมูลคนจอง
        await registerService.save({
            ...data,
            userId: idCardNumber || data.userId,
            reserveToken: null,
            registerCode,
            registerId,
            createAt: moment().format()
        })

        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    registerId,
                    registerCode,
                    entityId,
                    date,
                    time,
                    idCardNumber,
                    status: "ok"
                },
                null,
                2
            ),
        };

    } catch (error) {

        console.log(error)
        if (error.name == ERROR_CASE.ALREADY_REGISTER_IN_DATE) {
            return clientError(400,
                {
                    status: 'already_register',
                    errorMessage: "เลขบัตรนี้ได้เคยมีการลงทะเบียนไว้แล้วในนั้นที่เลือก"
                }
            )
        }

        //เต็ม
        if (error.name == ERROR_CASE.TIMESLOT_FULL) {
            FULL_HOLDER[genHashKey] = true;
            return clientError(400,
                {
                    status: 'full',
                    errorMessage: "ช่วงเวลาที่เลือกเต็มแล้ว"
                }
            )
        }


        throw error
        // // ให้ error
        // return {
        //     statusCode: error.httpStatusCode,
        //     body: JSON.stringify(error)
        // }
        // // // console.error(error, null , 2)

    }



};


function updateInventory(genHashKey) {
    var params = {
        TableName: TABLE_NAME,
        Key: {
            entity_date_time: genHashKey
        },
        UpdateExpression: 'SET #lastUpdate = :lastUpdate  ADD #reserve :reserveAddByOne ',
        ConditionExpression: "#reserve  < #open",  // dynamouse previuos value
        ExpressionAttributeNames: {
            '#reserve': 'reserve',
            "#open": 'open',
            '#lastUpdate': 'lastUpdate'
        },
        ExpressionAttributeValues: {
            ':reserveAddByOne': 1,
            ':lastUpdate': new Date().toISOString()
        }
    };

    // console.log(params)
    return dynamodbClient.update(params)
}
