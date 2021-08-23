



const { default: axios } = require('axios');
const http = require('http');
const https = require('https');

const _ = require('lodash')
const uuid = require('uuid')
const percentile = require("percentile");
const instance = axios.create(
    // {
    //     //keepAlive pools and reuses TCP connections, so it's faster
    //     httpAgent: new http.Agent({ keepAlive: true }),
    //     httpsAgent: new https.Agent({ keepAlive: true }),
    //     timeout: 60,
    // }
)



instance.interceptors.request.use((config) => {
    config.headers['request-startTime'] = new Date().getTime();
    return config
})

instance.interceptors.response.use((response) => {
    const currentTime = new Date().getTime()
    const startTime = response.config.headers['request-startTime']
    response.headers['request-duration'] = currentTime - startTime
    return response
})




module.exports.handler = async (event) => {

    console.log(event);

    let { batchSize, requestSize, url, data, key, name } = event
    let s_all = new Date().valueOf()

    //create array number 10K, 
    let array = _.range(0, requestSize);
    let batchList = _.chunk(array, batchSize);

    let res = []

    for (let index = 0; index < batchList.length; index++) {
        const batch = batchList[index];
        let promiseList = [];
        for (let j = 0; j < batch.length; j++) {

            const dataPost = {
                ...data,
                [key]: uuid.v4(),
                index: j
            }
            let p = instance.post(url, dataPost)
            promiseList.push(p);
        }
        let res2 = await Promise.all(promiseList);
        res.push(res2)
    }
    let time = []
    res.forEach(array2 => {
        let timeList = array2.map(a => {
            // console.log(a.headers['request-duration'])
            return a.headers['request-duration']
        })
        time.push(timeList)

    });
    let arrayDurationTime = _.flattenDeep(time)
    console.log(`shorest : ${_.min(arrayDurationTime)}`)
    console.log(`longest  : ${_.max(arrayDurationTime)}`);
    console.log(`mean  : ${_.mean(arrayDurationTime)}`)
    console.log(`p70 p80 p90  : ${percentile(
        [70, 80, 90], // calculates 70p, 80p and 90p in one pass
        arrayDurationTime
    )}`)

    let e_all = new Date().valueOf();
    console.log('name  = ' + name)
    console.log('TOTAL ms = ' + (e_all - s_all))


    // PUT to database
    // var params = {
    //     TableName: 'Q_Load_Test_Result',
    //     Item: {
    //         instanceId: name,
    //         min,
    //         max,

    //     }
    // };
    // let data = documentClient.put(params).promise()
}



module.exports.handler2 = async (event) => {

    console.log(event)
    let { batchSize, requestSize, url, data, key, name } = event

    let i = 0
    let total = 0
    let success = 0;
    let fail = 0;
    let pList = []
    while (i < requestSize) {
        total++
        const dataPost = {
            ...data,
            [key]: uuid.v4(),
            name
        }
        let p1 = instance.post(url, dataPost)
            .then(function () {
                success++
            }).catch(function () {
                fail++
            })
        pList.push(p1)
        if (total % 1000 == 0) {
            console.log(`${name} : ${total} passed,  (${success}/${fail})`)
        }
        i++
    }

    await Promise.all(pList)


    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('good')
        }, 30000)
    })
}
