

const handler = require('../web_admin/http_clear')

describe('CLEAR FUNCTION', function () {

    it('source : timslots', async function () {

        let event =  { 
            body : JSON.stringify( { 
                source : 'timeslots',
                entityId : '169312'
            })
        }
        await handler.any(event)
    });

    it('source : register', async function () {
        let event =  { 
            body : JSON.stringify( { 
                source : 'register',
                entityId : '169312'
            })
        }
        await handler.any(event)
    });


});

