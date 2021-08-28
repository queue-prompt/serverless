


# Dashboard

ภาพรวม API ทั้งหมด

| API         | Method | Path                           | Description                                  |
| ----------- | :----: | ------------------------------ | -------------------------------------------- |
| Entity      |  GET   | /entity?type                   | ดูรายชื่อหน่วยงานทั้งหมด                           |
|             |  GET   | /entity/{entityId}             | ดูข้อมูลรายละเอียดของหน่วยงาน                     |
|             |  POST  | /entity                        | ตั้งค่าข้อมูลของหน่วยงาน                           |
|             |  PUT   | /entity                        | อัพเดตข้อมูลของหน่วยงาน                          |
| Information |  GET   | /information/{entityId}/{type} | ดูข้อมูลเงื่อนไขของหน่วยงาน                        |
|             |  POST  | /information                   | ตั้งค่าเงื่อนไขของหน่วยงาน                         |
| Register    |  GET   | /register/{userId}?entityId    | ตรวจสอบการจองคิว                              |
|             |  POST  | /register                      | จองคิว                                        |
| Report      |  POST  | /report/reserved               | ดึงข้อมูลการจองคิวทั้งหมดของหน่วยงาน                |
| Server      |  GET   | /server/opentime               | เช็คว่าอีกกี่มิลลิวินาที จะถึงเวลาเปิดให้จองได้           |
| Timeslots   |  GET   | /timeslots/{entityId}          | ดูข้อมูลวันที่เปิดให้จองคิวทั้งหมดของหน่วยงาน            |
|             |  GET   | /timeslots?date=YYYY-MM-DD     | ดูข้อมูลวันที่เปิดให้จองคิวของทุกหน่วยงาน               |
|             |  GET   | /timeslots/{entityId}/{date}   | ดูข้อมูลตารางเวลารายละเอียดในวันนั้นๆ ใช้หน้าการจองคิว |
|             |  POST  | /timeslots                     | ดูข้อมูลดูภาพรวมของวันๆ หลายวัน                    |
|             |  PUT   | /timeslots                     | ตั้งค่าข้อมูลการจองคิว                             |
| Token       |  POST  | /token                         | สร้าง token ของแต่ละคน เพื่อใช้ในการจองคิว         |
| Users       |  GET   | /users/{userId}                | ดึงข้อมูลของ user (หน่วยงาน)                     |
|             |  POST  | /users                         | สร้าง user (หน่วยงาน)                          |
|             |  PUT   | /users                         | อัพเดตข้อมูล user (หน่วยงาน)                     |




API ของแต่ละ Resources สามารถตรวจสอบได้ที่ FOLDER Documents


# Stacks

- AWS Cloudfront เป็น CDN,  Cache
- Lamba 
- AWS ApiGateway (HTTP)
- Database Dynamodb
- DynamoDB Stream + Lambda ในการอัพเดทจำนวนคงเหลือ
