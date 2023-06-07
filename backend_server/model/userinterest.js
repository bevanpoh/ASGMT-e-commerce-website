//Admission No.: P2112745  
//Class: DAAA/1B02
//Name: Bevan Poh

const { del } = require('express/lib/application');
var db = require('./databaseConfig');

module.exports = {
    //POST /interest/:userid
    //insert interests into table with userid
    //returns result object or err object 
    //(result object to determine whether partial or full update)
    insertInterests: function (userid, interestsArray, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            var queryArray = [];
            var insertInterestsQuery =
                `
                INSERT INTO userinterest
                (userid, categoryid)
                VALUES
                `
            for (var i = 0; i < interestsArray.length; i++) { //for each category specified
                if (i > 0) {//if more than one insert required
                    insertInterestsQuery += ",";
                }
                insertInterestsQuery += "(?,?)"; //format query as required

                //insert required values
                queryArray.push(userid);
                queryArray.push(interestsArray[i]);
            }

            insertInterestsQuery += //to handle duplicates
                `
            as inserts
            ON DUPLICATE KEY UPDATE
            userid = inserts.userid,
            categoryid = inserts.categoryid;
            `
            console.log(insertInterestsQuery)

            conn.query(insertInterestsQuery,
                queryArray,
                function (err, result) {
                    conn.end();
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null);
                    else return callback(null, result);
                }
            )
        });
    },

    // GET /user/:id/interests
    //gets interests of user with specified id
    // returns array containing userinterests or err object
    getUserInterests: function (userid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) return callback(err, null);

            const getUserInterestsQuery =
                `
            SELECT 
                categoryid
            FROM 
                userinterest 
            WHERE userid = ?;
            `
            conn.query(getUserInterestsQuery,
                [userid],
                function (err, result) {
                    conn.end();
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null)
                    //if SELECT returned empty array
                    else if (result.length == 0) return callback(null, null);
                    else return callback(null, result);
                });
        });

    },

    //DELETE /user/interests
    //delete interests
    //returns number of affected rows or err object
    deleteInterests: function (userid, interestsArray, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            var deleteInterestQuery =
                `
                DELETE FROM userinterest
                WHERE userid = ? 
                AND categoryid in (?);
                `

            console.log(deleteInterestQuery);

            conn.query(deleteInterestQuery,
                [userid, interestsArray],
                function (err, result) {
                    conn.end();
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null);
                    else return callback(null, result.affectedRows);
                });
        });
    }

}

// function (callback) {
//     var conn = db.getConnection();
//     conn.connect(function (err) {
//         if (err) return callback(err, null);

//         const insertNewUserQuery =
//             `
//             `
//         conn.query();
//     });
// }
