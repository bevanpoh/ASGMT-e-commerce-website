//Admission No.: P2112745  
//Class: DAAA/1B02
//Name: Bevan Poh

var db = require('./databaseConfig');
const fse = require('fs-extra');
const path = require('path');

module.exports = {
    // PUT /product/:id/image/upload
    // updates imageurl of product from default to url of file multer created
    insertProductImageUrl: function (tmpPath, productBaseUrl, imageName, itemid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) {
                module.exports.deleteTmpFile(tmpPath);
                return callback(err, null);
            }

            const destPath = path.join(__dirname, '../images', productBaseUrl, imageName);
            fse.move(tmpPath, destPath)
                .then(() => {
                    console.log(`${imageName} moved from tmp to ${destPath}`);

                    //else continue with query
                    const updateImageUrlQuery =
                        `
                        UPDATE product
                        SET 
                        imageurl = ?
                        WHERE 
                        productid = ?;
                        `

                    conn.query(updateImageUrlQuery,
                        [productBaseUrl + imageName, itemid],
                        function (err, result) {
                            conn.end();
                            console.log(err);
                            console.log(result);
                            if (err) {
                                module.exports.deleteTmpFile(tmpPath);
                                return callback(err, null);
                            }

                            else return callback(null, result);
                        });
                })
                .catch(err => {
                    module.exports.deleteTmpFile(tmpPath);
                    console.error(err);
                    return callback(err, null);
                });
        });
    },

    //DELETE /product/:id/iamge/delete
    deleteProductImage: function (productBaseUrl, productid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            //if error connecting to database
            if (err) {
                return callback(err, null);
            }

            const getProductImageQuery = `
            SELECT
                imageurl
            FROM
                product
            WHERE
                productid = ?;
            `
            conn.query(getProductImageQuery,
                [productid],
                function (err, result) {
                    conn.end();
                    console.log(result);
                    console.log(err);

                    if (err) return callback(err, null);
                    const imageurl = result[0].imageurl;
                    if (imageurl === `${productBaseUrl}default_image.jpg`) return callback(null, null)

                    const imagePath = path.join(__dirname, '../images', imageurl)
                    fse.remove(imagePath)
                        .then(() => {
                            console.log(`file ${imagePath} removed`);
                            return callback(null, result)
                        })
                        .catch(err => {
                            return callback(err, null);
                        });

                })

        });
    },

    //runs on image upload or move error
    //deletes file from tmp folder
    deleteTmpFile: function (srcPath) {
        fse.remove(srcPath)
            .then(() => {
                console.log(`file ${srcPath} removed`)
            })
            .catch(err => {
                console.error(err);
            });
    }
}
