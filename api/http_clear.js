const { dynamodbClient } = require('../awsInstance')

let MAP = {
    timeslots: {
        TABLE_NAME: "Q_Timeslot_Time_Level",
        HASH_KEY: "entity_date_time",
        SEARCH_KEY: null
    },
    register: {
        TABLE_NAME: "Q_Register",
        HASH_KEY: "registerId",
        SEARCH_KEY: null
    },
}


module.exports.any = async (event) => {

    let { source, entityId } = JSON.parse(event.body)

    let M = MAP[source]
    // scan
    var params = {
        TableName: M.TABLE_NAME,
        FilterExpression: 'entityId = :entityId',
        ExpressionAttributeValues: { ':entityId': entityId.toString() }
    }
    let res = await dynamodbClient.scan(params)

    console.log(res)

    let keys = res.Items.map(item => item[M.HASH_KEY])
    // console.log(res)
    //remove 

    console.log(keys)
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        var params = {
            TableName: M.TABLE_NAME,
            Key: {
                [M.HASH_KEY]: key

            }
        };
        await dynamodbClient.delete(params)
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ status: 'ok' })
    }
}

