
const { lambdaClient } = require('../awsInstance')
const { InvokeCommand, InvokeCommandInput } = require("@aws-sdk/client-lambda");

init(1)
async function init(instanceCount) {


    let pAll = []
    for (let index = 0; index < instanceCount; index++) {
        // const element = array[index];

        // let data = {
        //     url: "https://cloudfront.api.คิวพร้อม.com/v1/loadtest/dynamodb_put",
        //     requestSize: 2500,
        //     batchSize: 10,  // open socket.
        //     data: { good: true },
        // methos: 'post',

        //     key: 'uuid',  //need to random
        //     name: 'instane ' + index
        // }

        let data = {
            url: "https://api.คิวพร้อม.com/v1/server/opentime",
            requestSize: 1000,
            batchSize: 300,  // open socket.
            methos: 'get',
            data: { good: true },
            key: 'uuid',  //need to random
            name: 'instane#' + index
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