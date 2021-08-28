# Timeslots

-  ### GET timeslot dates 

 ดูข้อมูลวันที่เปิดให้จองคิวทั้งหมดของหน่วยงานนั้นๆ
``` js
// REQUEST

Method: GET  
Path: /timeslots/{entityId}

```

``` js
// RESPONSE
{
	"$YYYY-MM-DD" :  {
		open : 12,
		reserve : 90,
		active : false,    //default true
	} ,
	...
}

```
<br>
<br>


-  ### GET timeslot dates all entiity

ดูข้อมูลวันที่เปิดให้จองคิวของทุกหน่วยงาน

``` js
// REQUEST

Method: GET  
Path: /timeslots?date=YYYY-MM-DD

query : date (optionl) หากไม่ใส่จะเป็นวันปัจจุบัน
```

``` js
// RESPONSE

{ 
	"$entityId_1: : { 
		open : 600,
		reserve : 500,
		avaliable : 100
	},
	"$entityId_2: : { 
		open : 600,
		reserve : 500,
		avaliable : 100
	},
	...
}
```
<br>
<br>


-  ### GET timeslot detail

ดูข้อมูลตารางเวลารายละเอียดในวันนั้นๆ ใช้หน้าการจองคิว

``` js
// REQUEST

Method: GET  
Path: /timeslots/{entityId}/{date}

```

``` js
// RESPONSE

{
	entityId :  "1234",
	date :  "YYYY-MM-DD",
	active :  true,  //defaul true
	timeslots :  [
		{
		time :  "1000-1100",
		open :  500,
		reserve :  100,
		},
		...
	]
}
```
<br>
<br>

  

- ### POST timeslot summary

ดูข้อมูลดูภาพรวมของวันๆ หลายวัน

``` js
//REQUEST

Method: POST 
Path: /timeslots

{
	entityId :  "",
	dateList:  ['YYYY-MM-DD'],
	timeslots : {
		"0900-1100" : 50,
		"1100-1200" : 50,
		"1300-1400" : 50,
		"1500-1600" : 50,
		...
	}
}
```

```js
// RESPONSE

{
	status :  "ok"
}
```
<br>
<br>


- ### PUT timeslot setting 

ใช้ในการตั้งค่าหรืออัพเดตข้อมูลการจองคิว  (Admin)

``` js
//REQUEST

Method: PUT 
Path: /timeslots

{
	entityId : "0000",  
	date : "YYYY-MM-DD",   
	time : "1000-1100",
	action : "open",  //  open, remove, active 
	value : 10,  //   ตัวเลข หรือ boolen ขึ้นกลับ action-type
}

action
- insert : เพิ่มแถว
- open :  แก้ไขจำนวนเวลาเปิดรับในเวลานั้น หากแก้ไขลดลงต้องไม่น้อยกว่าค่าที่จองไว้แล้วไม่งั้นจะ error 400
- active : เปิด ปิด ระบบของวันนั้นทั้งวัน value = true (เปิด) | false (ปิด)
- remove : ถ้าเวลา นั้น มีคนจองแล้วจะลบไม่ไ่ด้   error 400

//------ เงื่อนไข --------

REMOVE ROW
- ถ้ามีคนจองแล้วลบไม่ได้

UPDATE ROW
- open ต้องมากว่าที่มีนคนจองแล้ว
- 

ON_OFF_DATE
- เปิด ปิด ของทั้งวันนั้น

```

```js
// RESPONSE

{
	status :  "ok"
}
```