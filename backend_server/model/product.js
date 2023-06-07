//Admission No.: P2112745  
//Class: DAAA/1B02
//Name: Bevan Poh

const { query } = require('express');
const res = require('express/lib/response');
var db = require('./databaseConfig');

module.exports = {
    //POST /product/
    //creates product in table with provided details
    //returns ID of created product or err object
    insertNewProduct: function (productname, description, categoryid, brand, price, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const insertNewProductQuery =
                `
                INSERT INTO product
	                (productname, description, categoryid, brand, price)
                VALUES
	                (?, ?, ?, ?, ?);
                `
            conn.query(insertNewProductQuery,
                [productname, description, categoryid, brand, price],
                function (err, result) {
                    conn.end();
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null);
                    else return callback(null, result.insertId);
                });
        });
    },

    //GET /prodcut/:id
    //retrieves product with specified id details
    //returns array of product with ID, null or err object
    getIdProduct: function (productid, callback) {
        var conn = db.getConnection();

        console.log(productid);

        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const getIdProductQuery =
                `
                SELECT 
	                p.productname, 
                    p.description, 
                    p.categoryid, 
                    c.categoryname, 
                    p.brand, 
                    p.price,
                    p.imageurl
                FROM 
	                product p, 
                    category c
                WHERE 
	                p.productid = ? 
                    AND c.categoryid = p.categoryid;
                `
            conn.query(getIdProductQuery,
                [productid],
                function (err, result) {
                    conn.end();
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null);
                    //if SELECT returned empty array
                    else if (result.length == 0) return callback(null, null);
                    else return callback(null, result);
                });
        });
    },

    //DELETE /product/:id/
    //deletes product with specified id
    //returns number of affected rows or err object
    deleteIdProduct: function (productid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const deleteIdProductQuery =
                `
                DELETE FROM product
                WHERE productid = ?;
                `
            conn.query(deleteIdProductQuery,
                [productid],
                function (err, result) {
                    conn.end();
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null);
                    else return callback(null, result.affectedRows);
                });
        });
    },

    //GET /prodcut/random
    //retrieves 6 random products
    //returns array of products, null or err object
    get6RandomProducts: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const get10RandomProducts =
                `
                SELECT 
                    p.productid,
	                p.productname, 
                    c.categoryname, 
                    p.brand, 
                    p.price,
                    p.imageurl
                FROM 
	                product p, 
                    category c

                WHERE 
                    c.categoryid = p.categoryid

                ORDER BY RAND()

                LIMIT 6
                `
            conn.query(get10RandomProducts,
                function (err, result) {
                    conn.end();
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null);
                    //if SELECT returned empty array
                    else if (result.length == 0) return callback(null, null);
                    else return callback(null, result);
                });
        });
    },

    //GET /prodcut/random
    //retrieves all products
    //returns array of products, null or err object
    getAllProducts: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const getAllProducts =
                `
                SELECT 
                    p.productid,
	                p.productname, 
                    p.description,
                    p.categoryid,
                    c.categoryname, 
                    p.brand, 
                    p.price,
                    p.imageurl
                FROM 
	                product p, 
                    category c

                WHERE 
                    c.categoryid = p.categoryid
                ORDER BY
                    p.created_at DESC;
                `
            conn.query(getAllProducts,
                function (err, result) {
                    conn.end();
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null);
                    //if SELECT returned empty array
                    else if (result.length == 0) return callback(null, null);
                    else return callback(null, result);
                });
        });
    },

    //PUT /product/:id/
    //updates product with sepcified id's details
    //returns result object or err object (result object to check both affectedRows and changedRows)
    updateIdProductDetails: function (productid, productname, categoryid, description, brand, price, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const getExistingProduct =
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
            conn.query(getExistingProduct, //first retrieve products's current details to avoid null fields
                [productid],
                function (err, result) {
                    console.log(err);
                    console.log(result);
                    //if error connecting to database
                    if (err) return callback(err, null);


                    if (result.length > 0) { //if current product found
                        //if any fields are empty, replace with current details
                        if (!productname) productname = result[0].productname;
                        if (!categoryid) categoryid = result[0].categoryid
                        if (!description) description = result[0].description;
                        if (!brand) brand = result[0].brand;
                        if (!price) price = result[0].price;
                    }
                    const updateProductQuery =
                        `
                        UPDATE product
                        SET 
	                        productname = ?, 
                            categoryid = ?, 
                            description = ?, 
                            brand = ?, 
                            price = ?
                        WHERE 
                            productid = ?;
                         `
                    //then execute update
                    conn.query(updateProductQuery,
                        [productname, categoryid, description, brand, price, productid],
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

    //GET /products/search
    //keyword, nameMatch and brandMatch are form query string and specify which cols to apply LIKE keyword
    //nameMatch & brandMatch is either empty str or undefined
    getProductbyKeywords: function (nameKeyword, brandKeyword, callback) {
        var conn = db.getConnection();

        nameKeyword = `%${nameKeyword}%`
        brandKeyword = `%${brandKeyword}%`

        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            const getProductsbyKeywordsQuery = `
            SELECT 
                productname,
                brand,
                productid,
                price,
                description,
                imageurl
            FROM 
                product
            WHERE
                productname LIKE ? 
                OR brand LIKE ?
            ORDER BY
                (productname LIKE ? AND brand LIKE ?) DESC
                `

            conn.query(getProductsbyKeywordsQuery,
                [nameKeyword, brandKeyword, nameKeyword, brandKeyword],
                function (err, result) {
                    conn.end();
                    console.log(result)
                    console.log(err)

                    if (err) return callback(err, null)

                    else if (result.length === 0) return callback(null, null);
                    else return callback(null, result);
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