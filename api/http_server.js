const moment = require('moment');
const { getTomorrowYYYY_MM_DD, getTodayYYYY_MM_DD } = require('../utils');
const { success } = require('../utils/http_response');


const OPEN_LONGER_THAN_BIUSINESS_HOUR = 1000 * 60 * 60 * 9
module.exports.openTime = async (event) => {

    console.log(event)
    let { date, time } = event.queryStringParameters || {
        date: moment().utcOffset("+07:00").set("hour", 9).set('minute', 0).set('second', 0).format("YYYY-MM-DD"),
        time: '0900'
    }

    let now = moment().utcOffset("+07:00");;

    let target = moment(`${date}T${time}`, 'YYYY-MM-DDTHH:mm').utcOffset("+07:00", true).set('second', 0);

    let diffMS = target.valueOf() - now.valueOf()

    let cacheTime = 0; //sec

    let delay = diffMS <= 0 ? 0 : diffMS

    return success({
        target: target.format('YYYY-MM-DDTHH:mm:ss'),
        delay: delay, //ms
        today: getTodayYYYY_MM_DD(),
        tomorrow: getTomorrowYYYY_MM_DD(),
        timestamp: new Date().valueOf()
    }, { cache: cacheTime })

};


module.exports.timestamp = async (event) => {



    return success({
        timestamp: new Date().valueOf(),//ms
        today: getTodayYYYY_MM_DD(),
        tomorrow: getTomorrowYYYY_MM_DD(),
    }, { cache: 0 })

};
