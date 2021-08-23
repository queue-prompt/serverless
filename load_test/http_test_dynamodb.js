
const { dynamodbClient } = require('../awsInstance')
const uuid = require('uuid')
// write direct to dynamodb. 



module.exports.put = async (event, a, b) => {

    const secondsSinceEpoch = Math.round(Date.now() / 1000)

    var params = {
        TableName: 'Q_Load_Test',
        Item: {
            uuid: uuid.v4(),
            ttl: secondsSinceEpoch + (1 * 60 * 60)

        }
    };
    await dynamodbClient.put(params)

    return {
        statusCode: 200,

        body: JSON.stringify(
            {
                stats: 'ok'
            },
            null,
            2
        ),
    };

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

// module.exports.update_condition = async (event, a, b) => {


//     var params = {
//         TableName: 'Q_Load_Test',
//         Item: {
//             uuid: uuid.v4()
//         }
//     };
//     await dynamodbClient.put(params)

//     return {
//         statusCode: 200,

//         body: JSON.stringify(
//             {
//                 stats: 'ok'
//             },
//             null,
//             2
//         ),
//     };

//     // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//     // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };



