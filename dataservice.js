
const { dynamodbClient } = require('./awsInstance')
const { removeSpecialChars } = require('./utils')

const _ = require('lodash')
function DataServiceClass(TableName, _key1, { searchKey, indexTableName } = {}) {

    const TABLE_NAME = TableName;
    const INDEX_TABLE_NAME = indexTableName;
    const key1 = _key1;
    const key2 = searchKey;

    return {
        get: get,
        save: save,
        update: update,
        query: query,
        scan: scan
    };

    function get(value1, value2) {
        var params = {
            TableName: TABLE_NAME,
            Key: {
                [key1]: value1
            },
            ReturnConsumedCapacity: "TOTAL",
            ReturnItemCollectionMetrics: "SIZE"
        };
        if (key2 && value2) {
            params.Key[key2] = value2
        }

        return dynamodbClient.get(params)
    }
    function save(item) {
        var params = {
            TableName: TABLE_NAME,
            Item: item,
            ReturnConsumedCapacity: "TOTAL",
            ReturnItemCollectionMetrics: "SIZE"
        };
        return dynamodbClient.put(params)
    }

    function update(value1, value2_Or_dataHolder, dataHolder = null) {
        let _data = null;
        let value2 = null;


        if (dataHolder == null) {
            // 2 params
            _data = value2_Or_dataHolder;
        } else {
            // 3 params
            _data = dataHolder;
            value2 = value2_Or_dataHolder;
        }
        _data = _.omit(_data, [key1, key2])
        var params = {
            TableName: TABLE_NAME,
            Key: { [key1]: value1 },
            UpdateExpression: getUpdateExpression('set', _data, key1, key2),
            ExpressionAttributeNames: getAttrbuiteNames(_data, key1, key2),
            ExpressionAttributeValues: getAttrbuiteValues(_data, key1, key2)
        };

        if (key2 && value2 && _data) {
            params.Key[key2] = value2
        }

        console.log(params)
        return dynamodbClient.update(params)
    }

    function scan() {

        let p = new Promise(async (resolve) => {

            var params = {
                TableName: TABLE_NAME,
            }

            var lasyKey = null;
            var res = [];
            do {
                lasyKey ? (params.ExclusiveStartKey = lasyKey) : null;
                var data = await dynamodbClient.scan(params)
                res = res.concat(data.Items);
                lasyKey = data.LastEvaluatedKey;
            } while (data.LastEvaluatedKey);

            resolve({
                Items: res
            })
        })

        return p
    }

    function query(value1, value2) {

        let p = new Promise(async (resolve) => {


            var params = {
                TableName: TABLE_NAME,

                KeyConditionExpression: '#hkey = :hkey',
                ExpressionAttributeNames: {
                    '#hkey': key1,
                },
                ExpressionAttributeValues: {
                    ':hkey': value1,
                }
            };

            if (INDEX_TABLE_NAME) {
                params.IndexName = INDEX_TABLE_NAME;
            }
            var lasyKey = null;
            var res = [];
            do {
                lasyKey ? (params.ExclusiveStartKey = lasyKey) : null;
                var data = await dynamodbClient.query(params)
                res = res.concat(data.Items);
                lasyKey = data.LastEvaluatedKey;
            } while (data.LastEvaluatedKey);

            resolve({
                Items: res
            })
        })

        return p

    }

    // private 

    function getUpdateExpression(type, dataHolder, key1, key2) {


        let updateExpression = _.reduce(dataHolder, (acc, reserveAmount, timeKey) => {
            let str = removeSpecialChars(timeKey)
            acc.push(`#${str} = :${str}`)

            return acc
        }, [])
        return type + " " + updateExpression.join(', ')

    }

    function getAttrbuiteNames(dataHolder, key1, key2) {

        let res = {}
        _.forEach(dataHolder, (value, key) => {
            if (key1 == key || key2 == key) {
                return
            }
            let key_removed = removeSpecialChars(key)

            res[`#${key_removed}`] = key
        });
        return res;
    }

    function getAttrbuiteValues(dataHolder, key1, key2) {

        let res = {}
        _.forEach(dataHolder, (value, key) => {
            if (key1 == key || key2 == key) {
                return
            }
            let key_removed = removeSpecialChars(key)

            res[`:${key_removed}`] = value
        })
        return res;
    }


}

module.exports = {
    entityService: DataServiceClass('Q_Entity', 'entityId'),
    infoService: DataServiceClass('Q_Information', 'entityId'),
    profileService: DataServiceClass('Q_Profile', 'profileId'),
    registerService: DataServiceClass('Q_Register', 'registerId'),
    timeslotDateLevelService: DataServiceClass('Q_Timeslot_Date_Level', 'entityId', {
        searchKey: 'date'
    }),
    timeslotTimeLevelService: DataServiceClass('Q_Timeslot_Time_Level', 'entity_date_time'),
    userService: DataServiceClass('Q_User', 'userId')

}

