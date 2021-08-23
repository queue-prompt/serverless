const moment = require('moment');
const { getTomorrowYYYY_MM_DD, getTodayYYYY_MM_DD } = require('../utils');
const { success } = require('../utils/http_response');


const OPEN_LONGER_THAN_BIUSINESS_HOUR = 1000 * 60 * 60 * 9
module.exports.openTime = async (event) => {

    let now = moment().utcOffset("+07:00");;

    let _9am = moment().utcOffset("+07:00").set("hour", 9).set('minute', 0).set('second', 0);

    let diffMS = _9am.valueOf() - now.valueOf()
    let delay = 0;
    let cacheTime = 10  //sec

    if (diffMS > 0) {
        //ยังไม่เลย 09:00
        delay = diffMS
        cacheTime = 10  //10 sec
    } else {
        //เลย 09:00   
        delay = 0
        cacheTime = 60 * 30  //cache 30 mins
    }

    return success({
        delay: delay, //ms
        today: getTodayYYYY_MM_DD(),
        tomorrow: getTomorrowYYYY_MM_DD(),
        timestamp: new Date().valueOf()
    }, { cache: cacheTime })

};


module.exports.timestamp = async (event) => {

    let now = moment().utcOffset("+07:00");;

    let _9am = moment().utcOffset("+07:00").set("hour", 9).set('minute', 0).set('second', 0);

    let diffMS = _9am.valueOf() - now.valueOf()
    let delay = 0
    if (diffMS > 0) {
        //ยังไม่เลย 09:00
        delay = diffMS
    } else if (diffMS < 0 && Math.abs(diffMS) < OPEN_LONGER_THAN_BIUSINESS_HOUR) {
        //เลย 09:00  แต่ยังอยู่ในเวลางาน
        delay = 0
    } else {
        // ไปรอ 09:00 next day
        _9am.add(1, 'day').valueOf()
        let diffMS_Tomorrow = _9am.valueOf() - now.valueOf()
        delay = diffMS_Tomorrow
    }

    return success({
        timestamp: new Date().valueOf() //ms
    }, { cache: 10 })

};
