//Admission No.: P2112745  
//Class: DAAA/1B02
//Name: Bevan Poh

var app=require('./controller/app');

var port=8081;

var server=app.listen(port,function(){

    console.log("BackEnd http://localhost:%s",port);
});