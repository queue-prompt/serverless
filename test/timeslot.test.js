const { dynamodbClient } = require('../awsInstance')

const timeslotshandler = require('../web_admin/http_timeslot')

const _ = require('lodash')
const TABLE_TIME = 'Q_Timeslot_Time_Level';
const TABLE_DATE = 'Q_Timeslot_Date_Level';


describe('timeslot update handler ', function () {
 
    let dataTest = {
        entity_date_time: '0000:0001-01-01:0000-0100',
        entityId: '0000',
        date: '0001-01-01',
        open: 2,
        reserve: 0
    }

    this.timeout(5000);
    beforeEach(done => setTimeout(done, 500));

    describe('setup : สร้าง timeslot และจอง', function () {

        it('create timeslot', async function () {

            var params = {
                TableName: TABLE_TIME,
                Item: dataTest
            };
            await dynamodbClient.put(params)

        });

        it('get entity with date', async function () {

            let event = {
                pathParameters: {
                    entity: dataTest.entityId,
                    date: dataTest.date
                }

            }
            let res = await timeslotshandler.get(event)
            res.should.have.property('statusCode').equal(200);
            let json = JSON.parse(res.body);
            
            let open = _.get(json, 'time.0000-0100.open', -1)
            open.should.be.equal(2)

            let reserve = _.get(json, 'time.0000-0100.reserve', -1)
            reserve.should.be.equal(0)


        });


        it('get entity should return date holder', async function () {

            let event = {
                pathParameters: {
                    entity: dataTest.entityId,
                    
                }

            }
            let res = await timeslotshandler.getQuery(event)
            res.should.have.property('statusCode').equal(200);
            let json = JSON.parse(res.body);
            
            json.should.have.property('0001-01-01')

            let open = _.get(json, '0001-01-01.open', -1)
            open.should.be.equal(2)

            let reserve = _.get(json, '0001-01-01.reserve', -1)
            reserve.should.be.equal(0)

            let active = _.get(json, '0001-01-01.active', -1)
            active.should.be.equal(true)


        });


    });


    describe('ทดสอบ OPEN command', function () {

        it('แก้ไข open เพิ่ม ', async function () {

        });

        it('แก้ไข open ให้น่อยกว่า reserve ', async function () {

        });


    });

    describe('ทดสอบ REMOVE command', function () {

        it('ลบตัวที่ไม่มีคนจอง', async function () {

        });

        it('ลบตัวที่มีคนจองแล้ว', async function () {

        });


    });

    describe('ทดสอบ Active command', function () {

        it('ตั้ง ปิด ของวันนั้นๆ', async function () {

        });

    });

    after(() => {
        //clean data
    })
});