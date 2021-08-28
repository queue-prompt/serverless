# Users

- ### GET user
ใช้ในการดึงข้อมูลของ user (Admin)

``` js
// REQUEST

Method : GET
PATH : /users/{userId}

```

```js
//RESPONSE

{
	userId : "1234" ,
	entityId : "1234" // เหมือนกันกับ 1234
	//...any data
}

```
<br>
<br>


- ### POST create user
ใช้ในการสร้าง user (Admin)

``` js
// REQUEST

Method : POST
PATH : /users

{
	uid : "1234" ,
	... ข้อมูลของ user (ใส่ทั้งหมด)
}

```

```js
//RESPONSE

{
	userId : "1234" ,
	entityId : "5678" ,

	status : "ok"	   //    ok | ANY , 
	errorMessage  : "" // alert this if status is not OK

}

```
<br>
<br>



- ### PUT update user (partial update)
ใช้ในการอัพเดตข้อมูล user (Admin)

``` js
// REQUEST

Method : PUT (partial update)
PATH : /users

{
	userId : "1234" ,
	key_to_update_1 : value,
	key_to_update_2 : value,
	...
	key_to_update_N : value,
}

```

```js
//RESPONSE

{
	userId : "1234" ,
	
	status : "ok"	   //    ok | ANY , 
	errorMessage : "" // alert this if status is not OK

}

```