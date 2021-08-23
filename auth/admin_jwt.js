var jwt = require('jsonwebtoken');

module.exports.handler = async (event) => {

    try {


        // console.log(event);
        let currentTime = event.requestContext.timeEpoch;
        let [bearer, token_id] = event.headers.authorization.split(' ')


        //by pass when debug
        if (token_id == "niceloop") {
            return {
                "isAuthorized": true,
                "context": {
                    userId: "0000"
                }
            }
        }

        var decoded = jwt.decode(token_id, { complete: true });

        let { payload } = decoded

        let auth = true
        // # step 4 check :  google and  line
        let isFirebaseJwt = payload.iss.indexOf('https://securetoken.google.com/') >= 0
        if (payload.iss != 'https://access.line.me' && !isFirebaseJwt) {
            auth = false
        }

        if (payload.exp > currentTime) {
            auth = false
        }


        return {
            "isAuthorized": auth,
            "context": {
                ...payload,
                userId: payload.sub,
            }
        }
    } catch (error) {
        return {
            "isAuthorized": false,
            "context": {
            }
        }
    }
}