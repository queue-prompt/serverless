# Information

- ### GET information
ใช้ดูข้อมูลเงื่อนไขของหน่วยงานนั้นๆ

``` js
//REQUEST

Method :  GET  
Path  :  /information/{entityId}/{type}

type = "pre_register"

```

``` js
// RESPONSE

{
	entityId : "",
	type = "pre_register",
	text  : "long_text"
}

```
<br>
<br>


- ### POST setting information
ใช้ในการตั้งค่าเงื่อนไขต่างๆของหน่วยงาน (Admin)

``` js
// REQUEST

Method : POST 
Path : /information 

{ 
	entityId : "1234" , 
	type = "pre_register", 
	text : "long_text" 
}

```

``` js
// RESPONSE

{
	entityId : "1234" ,
	type = "pre_register"

	status : "ok"	   //    ok | ANY , 
	errorMessage : "reason_text" // alert this if status is not OK
}

```