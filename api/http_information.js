'use strict';

const { infoService } = require('../dataservice')
const _ = require('lodash')
const { success } = require('../utils/http_response')



module.exports.get = async (event) => {



    let { entityId, type } = event.pathParameters

    let hash_key = `${entityId}:${type}`
    let res = await infoService.get(hash_key)

    return success(res.Item, { cache: process.env.CACHE })


};



// create + update
module.exports.post = async (event) => {



    let data = JSON.parse(event.body);

    let entityId = `${data.entityId}:${data.type}`
    await infoService.update(entityId, data)


    return success({ status: "ok" })



};