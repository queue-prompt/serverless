

var jwt = require('jsonwebtoken');
const { getTomorrowYYYY_MM_DD, getTodayYYYY_MM_DD } = require('../utils');
const PRIVATE_KEY = process.env.PRIVATE_KEY
module.exports.post = async function (event) {

    // console.log(PRIVATE_KEY)

    let data = JSON.parse(event.body)
    var token = jwt.sign(data, PRIVATE_KEY, {
        subject: data.idCardNumber,
        issuer: "คิวพร้อม.com",
        expiresIn: '30m'
    });


    console.log(token)
    return {
        statusCode: 200,
        body: JSON.stringify({
            token: token,
            status: "ok",
            today: getTodayYYYY_MM_DD(),
            tomorrow: getTomorrowYYYY_MM_DD(),
            timestamp: new Date().valueOf()
        })
    }

}

