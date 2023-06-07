//Admission No.: P2112745  
//Class: DAAA/1B02
//Name: Bevan Poh

const mysql=require('mysql');

module.exports={

    getConnection:function(){
        var conn=mysql.createConnection({
            host:"localhost",
            user:"root",
            password:"test",
            database:"sp_it"

        }
        );

        return conn;
    }
}