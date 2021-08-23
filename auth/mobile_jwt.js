var jwt = require('jsonwebtoken');
const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports.handler = async (event) => {

    try {


        // console.log(event);
        //  let currentTime = event.requestContext.timeEpoch;
        let [bearer, token_id] = event.headers.authorization.split(' ')



        var decoded = jwt.verify(token_id, PRIVATE_KEY);


        return {
            "isAuthorized": true,
            "context": {
                ...decoded,
                userId: decoded.sub,
            }
        }
    } catch (error) {

        console.log(error)
        return {
            "isAuthorized": false,
            "context": {
            }
        }
    }
}

