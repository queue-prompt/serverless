
//dynamo
const { DynamoDB } = require("@aws-sdk/client-dynamodb"); // CommonJS import
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb"); // CommonJS import
const { LambdaClient, } = require("@aws-sdk/client-lambda");
//sqs
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs"); // CommonJS import
require('dotenv').config();


var _default_config = {
    region: "ap-southeast-1"
}

//if not prod will use profiule

if (!process.env.PROD) {
    //in local
    console.log('not PRID')
    const { fromIni } = require("@aws-sdk/credential-provider-ini");

    _default_config.credentials = fromIni({ profile: 'queue_register' })
}

const dynamo_client = new DynamoDB(_default_config);





module.exports = {
    sqs: new SQSClient(_default_config),
    dynamodbClient: DynamoDBDocument.from(dynamo_client),
    lambdaClient: new LambdaClient(_default_config)
};