const { marshall } = require("@aws-sdk/util-dynamodb");

const streamHandler = require('../stream/timeslot_time_to_date')

xdescribe('TEST Stream Update', function () {


    let dataTest = {
        entity_date_time: '0000:0001-01-01:0000-0100',
        entityId: '0000',
        date: '0001-01-01',
        open: 2,
        reserve: 1
    }

    this.timeout(5000);
    beforeEach(done => setTimeout(done, 500));

    describe('setup : สร้าง timeslot และจอง', function () {

        it('update timeslot', async function () {

            var event = {
                Records: [
                    {
                        "dynamodb": {
                            "NewImage": marshall(dataTest)
                        },
                        "eventName": "INSERT",
                    }
                ]
            }

           let res =  await streamHandler.handler(event)
           res.should.have.property('status').equal('ok')

        }); 

        it('remove timeslot', async function () {

            var event = {
                Records: [
                    {
                        "dynamodb": {
                            "OldImage": marshall(dataTest),
                            "NewImage" : undefined
                        },
                        "eventName": "REMOVE",
                    }
                ]
            }

           let res =  await streamHandler.handler(event)
           res.should.have.property('status').equal('ok')

        }); 



    });




    after(() => {
        //clean data
    })
});