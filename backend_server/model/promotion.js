//Admission No.: P2112745  
//Class: DAAA/1B02
//Name: Bevan Poh

var db = require('./databaseConfig');

module.exports = {
    //POST /product/:id/promotion/
    //creates promotion in table with provided details
    //returns ID of created promotion or err object
    insertNewPromotion: function (discountname, description, discountstart, discountend, discountpercent,productid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const insertNewPromotionQuery =
                `
            INSERT INTO discount
                (discountname, description, discountstart, discountend, discountpercent,productid)
            VALUES
                (?, ?, ?, ?, ?, ?);

            `
            conn.query(insertNewPromotionQuery,
                [discountname, description, discountstart, discountend, discountpercent,productid],
                function (err, result) {
                    conn.end();
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null);
                    else return callback(null, result.insertId);
                });
        });
    },

    //GET /product/:id/promotions
    //retrieves active promotions of product with specified id details
    //returns array containing active promotions of product with ID, null or err object
    getIdProductPromotions: function(productid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const getIdProductPromotionsQuery =
                `
                SELECT 
	                disc.discountid,
                    disc.discountname,
                    disc.description,
                    disc.discountstart,
                    disc.discountend,
                    disc.discountpercent,
                    prod.price,
	                prod.price - (prod.price * disc.discountpercent) as price_after_discount
                FROM 
	                product prod, 
                    discount disc
                WHERE 
	                prod.productid = ?
	            AND prod.productid = disc.productid 
                AND disc.discountstart < NOW()
                AND disc.discountend > NOW() 
                ORDER BY price_after_discount ASC;
                `
            conn.query(getIdProductPromotionsQuery,
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

    //GET /product/:id/promotions
    //retrieves upcoming promotions of product with specified id details
    //returns array containing upcoming promotions of product with ID, null or err object
    getIdProductUpcomingPromotions: function(productid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const getIdProductUpcomingPromotionsQuery =
                `
                SELECT 
	                disc.discountid,
                    disc.discountname,
                    disc.description,
                    disc.discountstart,
                    disc.discountend,
                    disc.discountpercent,
                    prod.price,
	                prod.price - (prod.price * disc.discountpercent) as price_after_discount
                FROM 
	                product prod, 
                    discount disc
                WHERE 
	                prod.productid = ?
	            AND prod.productid = disc.productid 
                AND disc.discountstart > NOW()
                ORDER BY price_after_discount ASC;
                `
            conn.query(getIdProductUpcomingPromotionsQuery,
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

    //DELETE /promotion/:id
    //deletes promotion with specified id
    //returns number of affected rows or err object
    deleteIdPromotion: function(discountid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const deleteIdPromotionQuery =
                `
                DELETE FROM discount
                WHERE discountid = ?;
                `
            conn.query(deleteIdPromotionQuery,
                [discountid],
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