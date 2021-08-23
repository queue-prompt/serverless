'use strict';
const { entityService } = require('../dataservice')
const _ = require('lodash');
const { success } = require('../utils/http_response');



module.exports.list = async (event) => {

    // type == 100, 200
    let { type = 'all' } = event.queryStringParameters || {}
    let res = await entityService.scan()

    let data = _.filter(res.Items || [], e => e.type == type)
    if (type == 'all') {
        data = res.Items || []
    }


    // console.log(data)
    return success(data || [], { cache: process.env.CACHE })

};

module.exports.get = async (event) => {

    console.log(event)


    let entityId = event.pathParameters.entityId
    let res = await entityService.get(entityId)

    return success(res.Item, { cache: process.env.CACHE })

};

//update
module.exports.put = async (event) => {

    let data = JSON.parse(event.body);
    await entityService.update(data.entityId, data)

    return {
        statusCode: 200,

        body: JSON.stringify({
            entityId: data.entityId,
            status: 200,
            errorMessage: null
        })

    };

};


