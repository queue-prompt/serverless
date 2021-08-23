var jwt = require('jsonwebtoken');

module.exports.handler = async (event) => {



    // console.log(event);
    let [bearer, token_id] = event.headers.authorization.split(' ')

    if (token_id == "niceloop") {
        return {
            "isAuthorized": true,
            "context": {
                userId: "0000"
            }
        }
    } else {
        return {
            "isAuthorized": false,
            "context": {
                userId: "0000"
            }
        }
    }

}