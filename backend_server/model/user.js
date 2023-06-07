//Admission No.: P2112745  
//Class: DAAA/1B02
//Name: Bevan Poh

var config = require('../config/config.js');
var jwt = require('jsonwebtoken');
var db = require('./databaseConfig')


module.exports = {
    //POST /user/
    //creates user in table with provided details
    //returns ID of created user or err object
    insertNewUser: function (username, email, contact, password, type, profile_pic_url, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);
            //else continue with query
            const insertNewUserQuery =
                `
                INSERT INTO user
	                (username, email, contact, password, type, profile_pic_url)
                VALUES
	                (?,?,?,?,?,?);
                `
            conn.query(insertNewUserQuery,
                [username, email, contact, password, type, profile_pic_url],
                function (err, result) {
                    conn.end();
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null);
                    else return callback(null, result.insertId);
                });
        });
    },

    //GET /users/
    //retrieves all users details
    //returns array of users, null or err object
    getAllUsers: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            const getAllUsersQuery =
                `
                SELECT 
	                userid, 
                    username, 
                    email, 
                    contact, 
                    type, 
                    profile_pic_url, 
                    created_at 
                FROM 
	                user;
                `
            conn.query(getAllUsersQuery,
                function (err, result) {
                    conn.end();
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null);
                    //if SELECT returned empty array
                    else if (result.length === 0) return callback(null, null);
                    else return callback(null, result);
                });
        });
    },

    //GET /users/:id/
    //retrieves user with specified id edtails
    //returns array of user with ID, null or err object
    getIdUser: function (userid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            console.log("Connected! getuserid");
            const getIdUserQuery =
                `
                SELECT 
	                userid, 
                    username, 
                    email, 
                    contact, 
                    type, 
                    profile_pic_url, 
                    created_at 
                FROM 
	                user 
                WHERE 
	                userid = ?;
                `
            conn.query(getIdUserQuery,
                [userid],
                function (err, result) {
                    conn.end();
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null);
                    //if SELECT returned empty array
                    else if (result.length == 0) return callback(null, null);
                    else return callback(null, result[0]);
                });
        });
    },

    //PUT /users/:id/
    //updates user with sepcified id's details
    //returns result object or err object (result object to check both affectedRows and changedRows)
    updateIdUserDetails: function (userid, username, email, contact, password, type, profile_pic_url, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const getExistingUser =
                `
                SELECT 
                    username, 
                    email,
                    contact,
                    password,
                    type,
                    profile_pic_url
                FROM
                    user
                WHERE
                    userid = ?;

                `
            conn.query(getExistingUser, //first retrieve user's current details to avoid null fields
                [userid],
                function (err, result) {
                    console.log(err);
                    console.log(result);
                    //if error connecting to database
                    if (err) return callback(err, null);


                    if (result.length > 0) { //if user found
                        //if any fields are empty, replace with current details
                        if (!username) username = result[0].username;
                        if (!email) email = result[0].email
                        if (!contact) contact = result[0].contact;
                        if (!password) password = result[0].password;
                        if (!type) type = result[0].type;
                        if (!profile_pic_url) profile_pic_url = result[0].profile_pic_url;
                    }
                    const updateUserQuery =
                        `
                        UPDATE user
                        SET 
	                        username = ?, 
                            email = ?, 
                            contact = ?, 
                            password = ?, 
                            type = ?, 
                            profile_pic_url = ?
                        WHERE 
                            userid = ?;
                         `
                    //then execute update
                    conn.query(updateUserQuery,
                        [username, email, contact, password, type, profile_pic_url, userid],
                        function (err, result) {
                            conn.end();
                            console.log(err);
                            console.log(result);
                            if (err) return callback(err, null);
                            else return callback(null, result);
                        });
                });
        });
    },


    loginUser: function (username, password, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected! login");
                var sql = 'select userid,type from user where username=? and password=?';
                conn.query(sql, [username, password], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(`SQL ${err}`);
                        return callback(err, null);
                    }
                    else if (result.length === 0) {
                        return callback(null, null);
                    }
                    else {
                        var { userid, type } = result[0]
                        token = jwt.sign({ userid: userid, type: type }, config.key, {
                            expiresIn: '10h'
                        });

                        return callback(null, {
                            token: token,
                            userid: userid
                        });
                    }
                });
            }
        })
    },
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