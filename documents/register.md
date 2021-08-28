# Register

- ### GET check register 
ใช้ตรวจสอบการจองคิว

``` js
//REQUEST
Method : GET
PATH : /register/{userId}?entityId=1234
 
//smaple userId ="0000"
query : entityId (optionl)  หากต้องการให้กรอกเฉพาะ entity ที่ต้องการ

```

``` js
// RESPONSE (หากไม่มีการจาง จะส่ง array เปล่า[] กลับคืน )

[
	 {...ข้อมูลที่กรอกมาในหน้ากรอก ฟอร์มทั้งหมด ต่อ 1 คน},
	 //...{}
]
```
<br>
<br>


- ### POST  register queue
ใช้ ในจองคิว

``` js
//REQUEST
 
Method : POST
PATH : /register

Header
 -  Authorization :  'Bearer {token}'   

{
	userId  :  "เลขที่บัตรประชาชน",
	entity :  "1234",
	// ... ข้อมูลใน form ทั้งหมด,
}

```


``` js
// RESPONSE

{
	registerId  : "1234...5658",
	registerCode : "100104",
	
	status : "ok"	   //    ok | ANY , 
	errorMessage : "reason_text" // alert this if status is not OK
}

```