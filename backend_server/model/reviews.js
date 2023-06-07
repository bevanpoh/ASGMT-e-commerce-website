//Admission No.: P2112745  
//Class: DAAA/1B02
//Name: Bevan Poh

var db = require('./databaseConfig');

module.exports = {
    //PSOT product/:id/review/
    //creates product review in table with provided details
    //returns ID of created review or err object
    insertNewProductReview: function (productid, userid, rating, review, callback) {
        review = review.replace('<', '&lt;')
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const insertNewProductReviewQuery =
                `
                INSERT INTO review
	                (productid, userid, rating, review)
                VALUES
	                (?,?,?,?);
            `
            conn.query(insertNewProductReviewQuery,
                [productid, userid, rating, review],
                function (err, result) {
                    conn.end();
                    console.log('review connected')
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null);
                    else return callback(null, result.insertId);
                });
        });
    },

    //GET /rpoduct/:id/reviews
    //retrieves reviews of product with specified id details
    //returns array containing reviews of product with ID, null or err object
    getIdProductReviews: function (productid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const getIdProductReviewsQuery =
                `
                SELECT 
	                r.productid, 
                    r.userid, 
                    u.username, 
                    r.rating, 
                    r.review, 
                    UNIX_TIMESTAMP(r.created_at) as created_at
                FROM 
	                review r, 
                    user u
                WHERE 
	                r.productid = ? AND u.userid = r.userid
                ORDER BY created_at DESC;
                `
            conn.query(getIdProductReviewsQuery,
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

    //GET /rpoduct/:id/averageRating
    //retrieves reviews of product with specified id details
    //returns average review of product with ID, null or err object
    getIdProductAverageRating: function (productid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) return callback(err, null);

            //else continue with query
            const getIdProductAverageRatingQuery =
                `
                SELECT 
                    AVG(rating) as avgRating
                FROM 
	                review
                WHERE 
	                productid = ?;
                `
            conn.query(getIdProductAverageRatingQuery,
                [productid],
                function (err, result) {
                    conn.end();
                    console.log(err);
                    console.log(result);
                    if (err) return callback(err, null);
                    //if SELECT returned empty array
                    else if (result.length == 0) return callback(null, null);
                    // if avg function returned NULL
                    else if (!result[0].avgRating) return callback(null, { avgRating: 0 });
                    else return callback(null, result[0]);
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