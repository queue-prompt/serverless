'use strict';
const { dynamodbClient } = require('../awsInstance')
const { userService, entityService } = require('../dataservice')
const _ = require('lodash')
const { success } = require('../utils/http_response')

module.exports.get = async (event) => {

    let userId = event.pathParameters.userId
    let res = await userService.get(userId)

    return success(res.Item, { cache: process.env.CACHE })

};

//update
module.exports.put = async (event) => {

    let data = JSON.parse(event.body);
    await userService.update(data.userId, data)

    return success(res.data)


};


// create
module.exports.post = async (event) => {


    //TODO:  Scan first
    let Items = await userService.scan()

    let usedEntityIds = _.map(Items, line => line.entityId)
    let entityIdList = _.range(100000, 999999);
    let cleanEntityIdList = _.filter(entityIdList, (n) => {
        return !_.includes(usedEntityIds, n)
    })

    // use new number not duplicate
    let entityId = _.sample(cleanEntityIdList);




    let data = JSON.parse(event.body);
    data = {
        ...data,
        entityId: entityId.toString(),
        userId: data.uid,
        createAt: new Date().toISOString()
    };

    //svee user
    await userService.save(data)

    //save entity
    await entityService.save({
        ...data,
        entityId: entityId.toString(),
        userId: data.uid,
        active: true,
        createAt: new Date().toISOString()
    });

    return success({
        userId: data.uid,
        entityId: data.entityId,
    })

};