//Admission No.: P2112745  
//Class: DAAA/1B02
//Name: Bevan Poh

var db = require('./databaseConfig');

module.exports = {
    //POST /category
    //creates category in table with provided details
    //returns ID of created category or err object
    insertNewCategory: function (categoryname, description, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const insertCategoryQuery =
                `
                INSERT INTO category
	                (categoryname, description)
                VALUES
	                (?, ?);
                `
            conn.query(insertCategoryQuery,
                [categoryname, description],
                function (err, result) {
                    conn.end();
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null);
                    else return callback(null, result.insertId);
                }
            );
        });
    },

    //GET /category
    //retrieves all categories details
    //returns array of categories, null or err object
    getAllCategories: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const getCategoriesQuery =
                `
                SELECT * FROM category;
                `
            conn.query(getCategoriesQuery,
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

    //DELETE /category/:id/
    //deletes category with specified id
    //returns number of affected rows or err object
    deleteIdCategory: function (categoryid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const deleteIdCategoryQUery =
                `
                DELETE FROM category
                WHERE categoryid = ?;
                `
            conn.query(deleteIdCategoryQUery,
                [categoryid],
                function (err, result) {
                    conn.end();
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null);
                    else return callback(null, result.affectedRows);
                });
        });
    },

    //PUT /category/:id/
    //updates category with sepcified id's details
    //returns result object or err object (result object to check both affectedRows and changedRows)
    updateIdCategoryDetails: function (categoryid, categoryname, description, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const getExistingCategoryQuery =
                `
                SELECT 
                    productid, 
                    productname,
                    categoryid,
                    description,
                    brand,
                    price
                FROM
                    product
                WHERE
                    productid = ?;

                `
            conn.query(getExistingCategoryQuery, //first retrieve products's current details to avoid null fields
                [categoryid],
                function (err, result) {
                    console.log(err);
                    console.log(result);
                    //if error connecting to database
                    if (err) return callback(err, null);

                    if (result.length > 0) { //if current product found
                        //if any fields are empty, replace with current details
                        if (!categoryname) productname = result[0].productname;
                        if (!description) description = result[0].description;
                    }
                    const updateCategoryQuery =
                        `
                        UPDATE category
                        SET 
	                        categoryname = ?,  
                            description = ?
                        WHERE 
                            categoryid = ?;
                         `
                    //then execute update
                    conn.query(updateCategoryQuery,
                        [categoryname, description, categoryid],
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
