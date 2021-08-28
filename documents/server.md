# Server
- ### GET server opentime
ใช้เช็คว่าอีกกี่ มิลลิวินาที จะถึงเวลาเปิดให้จองได้
```js
// REQUEST

Method : GET  
Path :  /server/opentime

```

``` js
// RESPONSE

{ 
	delay : 1232423  // milli seconds,  ถ้ามีค่าเป็น 0 แปลว่าเปิดได้เลยเลยเวลา 9โมงมาแล้ว
	tomorrow : 'YYYY-MM-DD',
	today : 'YYYY-MM-DD',
	timestamp : 1232423 // server tim - milisec epoch
}
```