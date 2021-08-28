



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

    let { batchSize, requestSize, url, data, key, name, method } = event
    let s_all = new Date().valueOf()

    //create array number 10K, 
    let array = _.range(0, requestSize);
    let batchList = _.chunk(array, batchSize);

    let res = []

    for (let index = 0; index < batchList.length; index++) {
        const batch = batchList[index];
        let promiseList = [];
        for (let j = 0; j < batch.length; j++) {

            let p = null
            if (method == 'post') {

                const dataPost = {
                    ...data,
                    [key]: uuid.v4(),
                    index: j
                }
                p = instance.post(url, dataPost)
            } else {
                p = instance.get(url)

            }
            promiseList.push(p);
        }
        let res2 = await Promise.all(promiseList);
        console.log('done ' + index)
        res.push(res2)
    }
    let time = []
    res.forEach(array2 => {
        let timeList = array2.map(a => {
            // console.log(a.headers['request-duration'])
            return a.headers['request-duration']
        })
        // time.push(timeList)

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

// let data = {
//     url: "https://api.คิวพร้อม.com/v1/server/opentime",
//     requestSize: 200000,
//     batchSize: 100,  // open socket.
//     methos: 'get',
//     data: { good: true },
//     key: 'uuid',  //need to random
//     name: 'instane#' + 1
// }
// module.exports.handler(data)


module.exports.handler2 = async (event) => {

    const loadtest = require('loadtest');
    const options = {
        url: 'https://api.xn--42c6cjhs2b6b5k.com/v1/server/opentime',
        maxRequests: 200000,
        concurrency: 200,
        agentKeepAlive: true
    };
    let p = new Promise((resolve) => {
        console.log("start " + new Date().toLocaleString())

        loadtest.loadTest(options, function (error, result) {
            if (error) {
                return console.error('Got an error: %s', error);
            }
            console.log(result, null, 2)
            console.log('Tests run successfully');
            resolve(result)
        });
    })

    let r = await p

    console.log("ALL DONE")
    return r
}
// module.exports.handler2()//