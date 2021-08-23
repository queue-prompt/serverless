
const { lambdaClient } = require('../awsInstance')
const { InvokeCommand, InvokeCommandInput } = require("@aws-sdk/client-lambda");

init()
async function init() {


    let pAll = []
    for (let index = 0; index < 200; index++) {
        // const element = array[index];

        let data = {
            url: "https://cloudfront.api.คิวพร้อม.com/v1/loadtest/dynamodb_put",
            requestSize: 2500,
            batchSize: 10,  // open socket.
            data: { good: true },
            key: 'uuid',  //need to random
            name: 'instane ' + index
        }

        console.log('start' + index)

        const command = new InvokeCommand({
            FunctionName: "arn:aws:lambda:ap-southeast-1:840013303383:function:queue-register-dev-lambdaMassRequest",
            // FunctionName: 'arn:aws:lambda:ap-southeast-1:840013303383:function:queue-register-dev-lambdaMassRequest2',
            InvocationType: 'Event',
            Payload: JSON.stringify(data)
        });
        let p = lambdaClient.send(command)
        pAll.push(p)
    }
    await Promise.all(pAll)
    console.log("all started at :  " + new Date().toLocaleString())

}