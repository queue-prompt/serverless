# Entity
- ### GET all entity  
ใช้ดูรายชื่อหน่วยงานทั้งหมด

``` js
//REQUEST

Method : GET
PATH : /entity?type=100

query : type (optionl)  หากไม่ใส่ type จะมาทั้งหมด (ALL)
// type
// 100 : ตรวจโควิด  
// 200 : ฉีดวัคซีน 

```

``` js
// RESPONSE

[ 
	{...entity} // ข้อมูลของ entity นั้นๆ
]
```
<br>
<br>


- ### GET  entity  
ใช้ดูข้อมูลรายละเอียดของหน่วยงานนั้นๆ

``` js
//REQUEST

Method : GET
PATH : /entity/{entityId}

```


``` js
// RESPONSE

{
	entityId: "1234",
	...รายละเอียดของหน่วยงาน
}
```
<br>
<br>


- ### POST   entity  detail
ใช้ในการตั้งค่าข้อมูลของหน่วยงานนั้นๆ

``` js
//REQUEST

Method : POST
PATH : /entity

{
	entityId : "1234" ,
	...ข้อมูลที่เกี่ยวข้องของหน่วยงานนั้นๆ
}

```


``` js
// RESPONSE

{
	entityId : "1234" ,
	status : "ok"	   //    ok | ANY , 
	errorMessage : "reason_text" // alert this if status is not OK
}

```
<br>
<br>


- ### PUT   update entity  detail
ใช้ในการอัพเดตข้อมูลของหน่วยงานนั้นๆ

``` js
//REQUEST

Method : PUT (partial update)
PATH : /entity

{
	entityId : "1234" ,
	key_to_update_1 : value,
	key_to_update_2 : value,
	...
	key_to_update_N : value,
}

```


``` js
// RESPONSE

{
	entityId : "1234" ,
	status : "ok"	   //    ok | ANY , 
	errorMessage : "" // alert this if status is not OK
}

```