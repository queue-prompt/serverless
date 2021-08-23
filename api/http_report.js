const _ = require('lodash')
const TABLE_REIGSTER = "Q_Register"
const { dynamodbClient } = require('../awsInstance')
const { success } = require('../utils/http_response')




module.exports.reserved = async (event) => {

    let { entityId, date, } = JSON.parse(event.body)

    var params = {
        TableName: TABLE_REIGSTER,
        IndexName: 'entityId-date-index',
        KeyConditionExpression: '#entityId = :entityId and #date = :date',
        ExpressionAttributeNames: {
            '#entityId': 'entityId',
            '#date': 'date',
        },
        ExpressionAttributeValues: {
            ':entityId': entityId,
            ':date': date,
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

    res = _.sortBy(res, r => r.registerCode)
    return success({
        entityId,
        date,
        generateAt: new Date().toISOString(),
        list: res
    })



};

