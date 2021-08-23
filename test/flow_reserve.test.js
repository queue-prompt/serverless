
const mocha = require('mocha');
// const should = require('should');
const should = require('chai').should()
const { BASE_URL, token } = require('./config')
const axios = require('axios')

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    // timeout: 1000,
    headers: { 'Authorization': `bearer ${token}` }
});
const handler = require('../web_admin/http_timeslot').put
const { dynamodbClient } = require('../awsInstance')


xdescribe('สร้าง FLOW จองทั้งหมด ', function () {
    const mock = {
        entityId: "0000",
        dateList: ["0001-01-01"],
        timeslots: {
            "0000-0100": 10,
            "0100-0200": 10,
            "0200-0300": 10,
            "0300-0400": 10
        }
    }

    const mockPeople = {
        userId: '0000',
        idCardNumber: '0000',
        name: 'abc',
    }

    const mockRegister = {
        debug: true,
        date: "0001-01-01",
        time: "0000-0100",
        entityId: "0000",
        userId: '0000',
        //   idCardNumber: '0000',

        //reserveToken : "0000"
    }

    let registerIdHolder = {}
    this.timeout(10000);
    beforeEach(done => setTimeout(done, 500));

    describe('สร้าง timeslot', function () {

        it('Should return status ok', async function () {
            let res = await axiosInstance.post('/timeslots', mock)
            res.data.should.have.property('status').equal("ok")

        });

        it('timeslost should have 4 timeslots and 10 available each', async function () {
            let url = `/timeslots/${mock.entityId}/${mock.dateList[0]}`;
            let res = await axiosInstance.get(url)

            res.data.timeslots.should.have.lengthOf(4)
            let timeslots = res.data.timeslots
            for (let index = 0; index < timeslots.length; index++) {
                const element = timeslots[index];
                element.should.contain({ open: 10, reserve: 0 })
            }
        });
    });


    describe('จองคิว และ ตัดสต็อก', function () {

        let reserveToken = null;
        it('สร้าง reserve token', async function () {

            let res = await axiosInstance.post('/check', mockPeople);

            res.data.should.have.property('reserveToken');
            reserveToken = res.data.reserveToken;

        });

        it('/register should return registerCode', async function () {
            let r = {
                ...mockPeople,
                ...mockRegister
            }
            r.reserveToken = reserveToken
            let res = await axiosInstance.post('/register', r);
            res.data.should.have.property('registerId')
            res.data.should.have.property('registerCode')
            res.data.should.have.property('status').be.equal('ok')

            registerIdHolder[res.data.registerId] = true

        });

        it('DYNAMODB_Table register should have that data', async function () {
            let res = await axiosInstance.get(`/register/${mockRegister.userId}?entityId=${mockRegister.entityId}`);

            res.data.length.should.be.equal(1);
        });

        it('timeslot_DATE_level  ค่า reserve ต้องเพิ่มขึ้น 1', async function () {
            let url = `/timeslots/${mock.entityId}/${mock.dateList[0]}`;
            let res = await axiosInstance.get(url)
            res.data.timeslots[0].should.contain({ reserve: 1 })
        });

        xit('timeslot_TIME_level  ค่า reserve ต้องเพิ่มขึ้น 1', async function () {
            //ยังไมม่มี API
        });


    });

    describe('ลองจองคิวที่เต็มแล้ว', function () {

        it('จองเพิ่ม +9 คิว', async function () {


                let r = {
                    ...mockPeople,
                    ...mockRegister,
                    userId: index.toString(),
                    idCardNumber: index.toString()
                }
                //step1
                let res = await axiosInstance.post('/check', r);
                let { reserveToken } = res.data
                res.data.status.should.equal('ok')


                //step2
                r.reserveToken = reserveToken;
                let res2 = await axiosInstance.post('/register', r);
                res2.data.status.should.equal('ok')

                registerIdHolder[res2.data.registerId] = true

            
        });

        it('จองคิว +1  ต้องไม่ผ่าน', async function () {

            try {


                let r = {
                    ...mockPeople,
                    ...mockRegister,
                    userId: "10".toString(),
                    idCardNumber: "10".toString()
                }
                //step1
                let res = await axiosInstance.post('/check', mockPeople);
                let { reserveToken } = res.data
                res.data.status.should.equal('ok')


                //step2
                r.reserveToken = reserveToken;
                let res2 = await axiosInstance.post('/register', r);

            } catch (error) {
                // console.log(error.response.data);
                // console.log(error.response.status);
                // console.log(error.response.headers);

                error.response.data.should.have.property('status').equal('full')
                error.response.status.should.equal(400);
            }
        });



    });

    describe("Timeslot update command", () => {




        let commandDataDefault = {
            entityId: mock.entityId,
            date: mock.dateList[0],
            time: "0000-0100",
            // value: ,
            // action
        }

        describe('ทดสอบ OPEN command', function () {

            it('แก้ไข open เพิ่ม ', async function () {
                let cmd1 = {
                    ...commandDataDefault,
                    value: 20,
                    action: 'open'

                }

                let res = await handler({
                    body: JSON.stringify(cmd1)
                })
                res.statusCode.should.equal(200)
            });

            it('แก้ไข open ให้น่อยกว่า reserve ', async function () {

                let cmd1 = {
                    ...commandDataDefault,
                    value: 5,
                    action: 'open'

                }

                let res = await handler({
                    body: JSON.stringify(cmd1)
                })

                res.name.should.equal('ConditionalCheckFailedException')


            });


        });

        describe('ทดสอบ REMOVE command', function () {

            it('ลบตัวที่มีคนจองแล้ว', async function () {
                let cmd1 = {
                    ...commandDataDefault,
                    value: null,
                    action: 'remove'
                }

                let res = await handler({
                    body: JSON.stringify(cmd1)
                })

                res.name.should.equal('ConditionalCheckFailedException')

            });


            it('ลบตัวที่ไม่มีคนจอง', async function () {

                let cmd1 = {
                    ...commandDataDefault,
                    date: '0001-01-01',
                    time: "0300-0400",
                    value: null,
                    action: 'remove'

                }

                let res = await handler({
                    body: JSON.stringify(cmd1)
                })
                res.statusCode.should.equal(200)
            });



        });

        describe('ทดสอบ Active command', function () {

            it('ตั้ง ปิด ของวันนั้นๆ', async function () {
                let cmd1 = {

                    ...commandDataDefault,
                    value: false,
                    action: 'active'

                }

                let res = await handler({
                    body: JSON.stringify(cmd1)
                })

                res.statusCode.should.equal(200)

            });

        });
    })

    after(async () => {
        //clean data

        let date = mock.dateList[0];
        let { entityId, } = mock;

        //time_level
        for (const time in mock.timeslots) {
            let hashKey = `${entityId}:${date}:${time}`
            await _deleteDynamoItem("Q_Timeslot_Time_Level", 'entity_date_time', hashKey)
        }

        //#2
        //date_level
        let hashKey2 = `${entityId}:${date}`
        await _deleteDynamoItem("Q_Timeslot_Date_Level", 'entity_date', hashKey2)

        //#3
        //register  

        for (const registerIdKey in registerIdHolder) {
            await _deleteDynamoItem("Q_Register", 'registerId', registerIdKey)
        }


        //#4
        //entity
        await _deleteDynamoItem("Q_Entity", 'entityId', entityId)



    })
});



function _deleteDynamoItem(table, key1, value) {
    var params = {
        TableName: table,
        Key: {
            [key1]: value
        }
    };
    return dynamodbClient.delete(params)
}