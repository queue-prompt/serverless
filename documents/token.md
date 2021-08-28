# Token

- ### POST token for register queue
ใช้ในการสร้าง token ของแต่ละคน เพื่อใช้ในการจองคิว

``` js
#REQUEST 

Method : POST 
Path : /token

{ 
	idCardNumber : '1243324' //string 
	entityId : '12311', 
	date : 'YYYY-MM-DD' 
} 

```

``` js
 #RESPONSE 

{ 
	token : 'jwt.token.......', 
	status : 'ok' 
} 

// token นี้แนบไว้ใน header => Authorization : 'Bearer {token}'
```