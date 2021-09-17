const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const axios = require('axios').default
const URL_EMAIL_NOTIFYCATION = "https://asia-southeast1-queue-register-62fd2.cloudfunctions.net/reserveNotification"
module.exports.handler = async (event) => {

    let records = event.Records;
    for (let index = 0; index < records.length; index++) {
        const element = records[index];

        if (element.eventName == "INSERT") {
            let newImage = element.dynamodb.NewImage;
            let data = unmarshall(newImage);
            console.log(data)


            await axios.post(URL_EMAIL_NOTIFYCATION, data, {
                headers: {
                    authorization: "queue_prompt"
                }
            })

        }

    }

}
