


const _ = require('lodash')
const moment = require('moment');

function removeSpecialChars(str) {
    return str.replace(/[^a-zA-Z0-9]/g, "")
}

function removeBeginUnderscore(obj) {

    for (const key in object) {
        if (key[0] == "_") {
            delete obj[key]
        }
    }
}

function convertPathToObject(beginString, convertPathToObj, callback) {

    for (const key in object) {
        if (key.indexOf(beginString) == 0) {

            callback(key, object)
            delete object[key];
        }
    }
}

function getTodayYYYY_MM_DD() {



    let m = moment.utc().add(7, 'hours')
    return m.format('YYYY-MM-DD')

}

function getTomorrowYYYY_MM_DD() {



    let m = moment.utc().add(24 + 7, 'hours')
    return m.format('YYYY-MM-DD')

}

module.exports = {
    removeBeginUnderscore,
    removeSpecialChars,
    convertPathToObject,
    getTodayYYYY_MM_DD,
    getTomorrowYYYY_MM_DD
}