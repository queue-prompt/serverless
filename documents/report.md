# Report

- ### POST report reserved
ใช้ในการดึงข้อมูลการจองคิวทั้งหมดของหน่วยงาน ในเวลานั้นๆ

``` js
// REQUEST

Method : POST 
Path : /report/reserved 
 
{ 
	entityId : "1234" , 
	date : "YYYY-MM-DD"
} 

```

``` js
// RESPONSE 

{ 
	entityId : "1234" , 
	date : "YYYY-MM-DD", 
	generateAt : "time_iso", 
	list : [ 
		{ 
			birthDateTh: "YYYY-MM-DD", 
			birthDate: "YYYY-MM-DD", 
			firstName: "", 
			lastName: "", 
			gender: "", // male , female 
			idCardNumber: "", 
			mobile: "", 
			prefix: "", // นาย, นาง, นางสาว , เด็กชาย, เด็กหญิง  
			province: "", 
			lineId : "", 
			registerId : "", 
			registerCode : "",
			entityId, 
			date , 
			time : "10:00-11:00", 
			createAt : new Date().toISOString() 
		}, 
		... 
	] 
}
```