//Admission No.: P2112745  
//Class: DAAA/1B02
//Name: Bevan Poh

const express = require('express');
var cors = require('cors');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../images/tmp'))
    },
    filename: function (req, file, cb) {
        const filename = file.originalname.replace(/[/\\?%*:|"<>]/g, '');
        const extension = file.mimetype.split('/')[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, filename + '-' + uniqueSuffix + '.' + extension)
    },
    fileFilter: function (req, file, cb) {
        const whitelist = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'image/tiff',
            'image/gif'
        ]

        if (!whitelist.includes(file.mimetype)) {
            return cb(new Error('file is not allowed'))
        }

        cb(null, true)
    }
});

const multerUpload = multer({ storage: storage });

var app = express();

app.use(cors())
app.use(express.json({ limit: '3mb' }));
app.use(express.urlencoded({ limit: '3mb', extended: false }));


//checks if body keys are empty; i.e. undefined or ''
//returns array containing [check result boolean, errCode for error handler]
function hasEmptyValues(...keys) {
    for (var i = 0; i < keys.length; i++)
        if (!keys[i]) return [true, 'invalid body keys'];
    return [false, null];
};

//jwt auth functions
const auth = require('../auth/auth.js');

//validates param ids
app.param('id',
    function (req, res, next, id) {
        //checks if param.ids are valid integers; i.e. integer > 0 
        //returns array containing [check result boolean, errCode for error handler]
        function isInvalidId(paramId) {
            if (isNaN(parseInt(paramId))) return [true, 'invalid param id'];
            if (parseInt(paramId) <= 0) return [true, 'invalid param id'];
            return [false, null];
        };

        const [isInvalid, code] = isInvalidId(id)
        if (isInvalid) return next({ code: code });
        else next();
    });

//escapes HTML characters in body
app.all('*',
    function (req, res, next) {
        if (req.method === 'POST' || req.method === 'PUT') {
            console.log('replacing escape characters');
            console.log(req.body);
            const escapedBody = JSON.stringify(req.body).replace(/&/g, '&#38;')
                .replace(/</g, '&#60;')
                .replace(/>/g, '&#62;');
            // console.log(escapedBody);
            req.body = JSON.parse(escapedBody);
        }
        next();
    })


/**************** USER TABLE ENDPOINTS *****************/
const user = require('../model/user');

app.post('/users/',
    function (req, res, next) {

        //deconstructs necessary keys then checks for missing values
        var { username, email, contact, password, type, profile_pic_url } = req.body;
        const [isEmpty, errCode] = hasEmptyValues(username, email, contact, password, type)
        if (isEmpty) //if required keys are missing
            return next({ code: errCode }); //go to error handler middleware

        if (!profile_pic_url) //sets profile to default if not specified
            profile_pic_url = "default_profile.jpg";

        user.insertNewUser(username, email, contact, password, type, profile_pic_url,
            function (err, insertId) {
                if (err) { ///passes to err handler middleware, matches err.code from sqlError
                    return next(err)
                }
                //valid res
                else return res.status(201).json({ userid: `${insertId}` })
            });
    });

app.get('/users/',
    function (req, res, next) {
        user.getAllUsers(function (err, result) {
            if (err) { //passes to err handler middleware, matches err.code from sqlError
                return next(err)
            }
            else if (!result)
                return res.status(404).json({ message: `No existing records` })
            //valid res with array
            else return res.status(200).json(result)
        });
    });

app.route('/users/:id/')
    .get(auth.verifyToken,
        function (req, res, next) {
            var userid = parseInt(req.params.id);

            if (userid !== req.userid) { //if id in token is different from id in localStorage
                console.log('different user')
                return res.status(401).json({ message: 'unauthorized' })
            }

            user.getIdUser(userid,
                function (err, result) {
                    if (err) {//passes to err handler middleware, matches err.code from sqlError
                        return next(err)
                    }
                    else if (!result)
                        return res.status(404).json({ message: `User with id ${userid} not found` })
                    //valid res with array
                    else return res.status(200).json(result)
                })
        })

    .put(function (req, res, next) {
        var userid = req.params.id;

        //deconstructs necessary keys
        var { username, email, contact, password, code, profile_pic_url } = req.body;

        user.updateIdUserDetails(userid, username, email, contact, password, code, profile_pic_url,
            function (err, result) {
                if (err) {//passes to err handler middleware, matches err.code from sqlError
                    return next(err)
                }
                else if (!result.affectedRows) //if UPDATE updated no rows
                    return res.status(404).json({ message: `User with id ${userid} not found` })
                else if (!result.changedRows) //if UPDATED updated rows to current value
                    return res.status(409).json({ message: `Duplicate information provided, no changes occurred` })
                //valid res
                else return res.sendStatus(204)
            });
    });




/**************** CATEGORY TABLE ENDPOINTS *****************/
const category = require('../model/category');

app.route('/category')
    .post(auth.verifyToken,
        auth.verifyAdmin,
        function (req, res, next) {
            //deconstructs necesssary keys then checks for missing values
            var { description } = req.body;
            var categoryname = req.body.category;
            const [isEmpty, errCode] = hasEmptyValues(categoryname);
            if (isEmpty)//if required keys are missing
                return next({ code: errCode })//handle error

            if (!description) //sets description to default if not specified
                description = "No description"

            category.insertNewCategory(categoryname, description,
                function (err, insertId) {
                    if (err) {//passes to err handler middleware, matches err.code from sqlError
                        return next(err)
                    }
                    //valid res
                    else return res.sendStatus(204)
                });
        })

    .get(function (req, res, next) {
        category.getAllCategories(function (err, result) {
            if (err) {//passes to err handler middleware, matches err.code from sqlError
                return next(err)
            }
            else if (!result)
                return res.status(404).json({ message: `No existing records` })
            //valid res with array
            else return res.status(200).json(result)
        });
    });


app.route('/category/:id')
    .delete(auth.verifyToken,
        auth.verifyAdmin,
        function (req, res, next) {
            var categoryid = req.params.id;

            category.deleteIdCategory(categoryid,
                function (err, affectedRows) {
                    if (err) {//passes to err handler middleware, matches err.code from sqlError
                        return next(err)
                    }
                    else if (!affectedRows) //if DELETE deleted no rows
                        return res.status(404).json({ message: `Category with id ${productid} not found` });
                    //valid res
                    else return res.sendStatus(204)
                });
        })

    .put(auth.verifyToken,
        auth.verifyAdmin,
        function (req, res, next) {
            var categoryid = req.params.id;

            //deconstructs necessary keys
            var { description } = req.body;
            var categoryname = req.body.name;

            category.updateIdCategoryDetails(categoryid, categoryname, description,
                function (err, result) {
                    if (err) {//passes to err handler middleware, matches err.code from sqlError
                        return next(err)
                    }
                    else if (!result.affectedRows) //if UPDATE updated no rows
                        return res.status(404).json({ message: `Category with id ${userid} not found` })
                    else if (!result.changedRows) //if UPDATED updated rows to current value
                        return res.status(409).json({ message: `Duplicate information provided, no changes occurred` })
                    //valid res
                    else return res.sendStatus(204)
                });
        })



/**************** PRODUCT TABLE ENDPOINTS *****************/
const product = require('../model/product');

app.get('/product/random',
    function (req, res, next) {
        product.get6RandomProducts(function (err, result) {
            if (err) { //passes to err handler middleware, matches err.code from sqlError
                return next(err)
            }
            else if (!result)
                return res.status(404).json({ message: `No existing records` })
            //valid res with array
            else return res.status(200).json(result)
        })
    });

app.get('/products',
    function (req, res, next) {
        product.getAllProducts(function (err, result) {
            if (err) { //passes to err handler middleware, matches err.code from sqlError
                return next(err)
            }
            else if (!result)
                return res.status(404).json({ message: `No existing records` })
            //valid res with array
            else return res.status(200).json(result)
        })
    })

app.post('/product/',
    auth.verifyToken,
    auth.verifyAdmin,
    function (req, res, next) {
        console.log(req.body);
        //deconstructs necessary keys then checks for missing keys
        var { description, categoryid, brand, price } = req.body;
        const productname = req.body.name;
        const [isEmpty, errCode] = hasEmptyValues(productname, categoryid, brand, price)
        if (isEmpty)//if required keys are missing
            return next({ code: errCode })//go to error handler middleware

        if (!description) //sets description to default if not specified
            description = "No Description";

        product.insertNewProduct(productname, description, categoryid, brand, price,
            function (err, insertId) {
                if (err) {//passes to err handler middleware, matches err.code from sqlError
                    return next(err)
                }
                //valid res
                else return res.status(201).json({ productid: `${insertId}` })
            });
    });

app.route('/product/:id/')
    .get(function (req, res, next) {
        var productid = req.params.id;

        console.log('param ' + productid);

        product.getIdProduct(productid,
            function (err, result) {
                if (err) {//passes to err handler middleware, matches err.code from sqlError
                    return next(err);
                }
                else if (!result)
                    return res.status(404).json({ message: `Product with id ${productid} not found` });
                //valid res with object
                else return res.status(200).json(result[0]);
            });
    })

    .delete(auth.verifyToken,
        auth.verifyAdmin,
        function (req, res, next) {
            var productid = req.params.id;

            product.deleteIdProduct(productid,
                function (err, affectedRows) {
                    if (err) {//passes to err handler middleware, matches err.code from sqlError
                        return next(err)
                    }
                    else if (!affectedRows) //if DELETE deleted no rows
                        return res.status(404).json({ message: `Product with id ${productid} not found` });
                    //valid res
                    else return res.sendStatus(204)
                });
        })

    .put(auth.verifyToken,
        auth.verifyAdmin,
        function (req, res, next) {
            var productid = req.params.id;

            //deconstructs necessary keys
            var { productid, productname, categoryid, description, brand, price } = req.body;

            product.updateIdProductDetails(productid, productname, categoryid, description, brand, price,
                function (err, result) {
                    if (err) {//passes to err handler middleware, matches err.code from sqlError
                        return next(err)
                    }
                    else if (!result.affectedRows) //if UPDATE updated no rows
                        return res.status(404).json({ message: `Product with id ${id} not found` })
                    else if (!result.changedRows) //if UPDATED updated rows to current value
                        return res.status(409).json({ message: `Duplicate information provided, no changes occurred` })
                    //valid res
                    else return res.sendStatus(204)
                });
        });


app.get('/products/search',
    function (req, res, next) {
        console.log(req.query)
        var { name, brand } = req.query;

        if (!name) name = null;
        else name = name.replace(/&/g, '&#38;')
            .replace(/</g, '&#60;')
            .replace(/>/g, '&#62;');
        if (!brand) brand = null;
        else brand = brand.replace(/&/g, '&#38;')
            .replace(/</g, '&#60;')
            .replace(/>/g, '&#62;');

        product.getProductbyKeywords(name, brand,
            function (err, result) {
                if (err) { //passes to err handler middleware, matches err.code from sqlError
                    return next(err);
                }
                else if (!result)
                    return res.status(404).json({ message: `No matches found` });
                //valid res with array
                else return res.status(200).json(result);
            });
    });





/********************* IMAGE ENDPOINTS **********************/

const image = require('../model/image');
const { productBaseUrl } = require('../config/dirConfig.js');

app.put('/product/:id/image/upload',
    auth.verifyToken,
    auth.verifyAdmin,
    multerUpload.single(`imageUpload`),
    function (req, res, next) {
        const productid = req.params.id;
        const { filename, path } = req.file;


        image.insertProductImageUrl(path, productBaseUrl, filename, productid,
            function (err, result) {
                if (err) {//passes to err handler middleware, matches err.code from sqlError
                    return next(err)
                }
                else if (!result.affectedRows) //if UPDATE updated no rows
                    return res.status(404).json({ message: `Product with id ${productid} not found` })
                //valid res
                else return res.sendStatus(204)
            });
    },
);

app.delete('/product/:id/image/delete',
    function (req, res, next) {
        var productid = req.params.id;

        image.deleteProductImage(productBaseUrl, productid,
            function (err, result) {
                if (err) {//passes to err handler middleware, matches err.code from sqlError
                    return next(err)
                }
                else return res.sendStatus(204)
            });
    })


/**************** REVIEW TABLE ENDPOINTS *****************/
const reviews = require('../model/reviews');

app.post('/product/:id/review/',
    auth.verifyToken,
    function (req, res, next) {
        var productid = req.params.id;

        //deconstructs necessary keys then checks for missing values
        var { userid, rating, review } = req.body;
        const [isEmpty, errCode] = hasEmptyValues(userid, rating)
        if (isEmpty)//if required keys are missing
            return next({ code: errCode })//go to error handler middleware

        if (parseInt(userid) !== req.userid) //if id in localStorage different from id in token
            return res.status(401).send({ message: 'invalid userid' });

        if (!review) //sets review to default if not specified
            review = "No review";

        reviews.insertNewProductReview(productid, userid, rating, review,
            function (err, insertId) {
                if (err) { //passes to err handler middleware, matches err.code from sqlError
                    return next(err);
                }
                //valid res
                else return res.status(201).json({ reviewid: `${insertId}` })
            });
    });

app.get('/product/:id/reviews',
    function (req, res, next) {
        var productid = req.params.id;

        console.log('connected get');

        reviews.getIdProductReviews(productid,
            function (err, result) {
                if (err) {//passes to err handler middleware, matches err.code from sqlError
                    return next(err)
                }
                else if (!result)
                    return res.status(404).json({ message: `Product ${productid} has no reviews` })
                //valid res with array
                else return res.status(200).json(result)
            })
    });

app.get('/product/:id/averageRating',
    function (req, res, next) {
        var productid = req.params.id;

        console.log('connected get');

        reviews.getIdProductAverageRating(productid,
            function (err, result) {
                if (err) {//passes to err handler middleware, matches err.code from sqlError
                    return next(err)
                }
                else if (result === null)
                    return res.status(404).json({ message: `Product with id ${productid} not found` })
                //valid res with array
                else return res.status(200).json(result)
            })
    });


/**************** USERINTEREST TABLE ENDPOINTS *****************/
const userinterest = require('../model/userinterest');

app.post('/interest/:id',
    auth.verifyToken,
    function (req, res, next) {
        var userid = req.params.id

        //deconstructs necesarry keys then checks for missing values
        var { categoryids } = req.body
        console.log(categoryids);

        if (categoryids === 'undefined') return res.sendStatus(204);

        if (parseInt(userid) !== req.userid) //if id in localStorage different from id in token
            return res.status(401).send({ message: 'invalid userid' });

        //converts comma-separated string into array of values
        const interestsArray = categoryids.split(',')

        userinterest.insertInterests(userid, interestsArray,
            function (err, result) {
                if (err) {//passes to err handler middleware, matches err.code from sqlError
                    return next(err)
                }
                if (result.insertId) { //if an insert happened
                    if (result.changedRows) //if an update also happened
                        res.status(200).json({ message: `One or more duplicates provided, non-duplicates inserted` })
                    //valid res (only insert)
                    else return res.sendStatus(201)
                }
                else //no insert
                    return res.status(409).json({ message: `Duplicate information provided, no changes occurred` })

            })
    });

app.get('/user/:id/interests',
    auth.verifyToken,
    function (req, res, next) {
        const userid = req.params.id;

        //because param id is taken from localStorage and might be changed
        if (parseInt(userid) !== req.userid) //if id in localStorage different from id in token
            return res.status(401).send({ message: 'invalid userid' });

        userinterest.getUserInterests(userid,
            function (err, result) {
                if (err) {//passes to err handler middleware, matches err.code from sqlError
                    return next(err)
                }
                else if (result === null)
                    return res.status(404).json({ message: `No interests` })
                //valid res with array
                else return res.status(200).json(result)
            })
    });

app.delete('/user/:id/interests',
    auth.verifyToken,
    function (req, res) {
        var userid = req.params.id
        var { categoryids } = req.body;
        console.log(categoryids);
        //converts comma-separated string into array of values
        const interestsArray = categoryids.split(',');
        if (interestsArray.length === 0) return res.sendStatus(204);

        if (parseInt(userid) !== req.userid) //if id in localStorage different from id in token
            return res.status(401).send({ message: 'invalid userid' });

        userinterest.deleteInterests(userid, interestsArray,
            function (err, affectedRows) {
                console.log(affectedRows);

                if (err) return res.status(500).json({ message: 'Unknown error occurred' })
                else return res.sendStatus(204);
            })
    });



/**************** PROMOTION TABLE ENDPOINTS *****************/
const promotion = require('../model/promotion');
app.post('/product/:id/promotion/',
    function (req, res, next) {
        var productid = req.params.id

        //deconstructs necessary keys and then checks for missing values
        var { discountname, description, discountstart, discountend, discountpercent } = req.body
        const [isEmpty, errCode] = hasEmptyValues(discountname, discountstart, discountend, discountpercent)
        if (isEmpty)//if required keys are missing
            return next({ code: errCode })//go to error handler middleware

        if (!description) //sets description to default if missing
            description = 'No description'

        promotion.insertNewPromotion(discountname, description, discountstart, discountend, discountpercent, productid,
            function (err, insertId) {
                if (err) { //passes to err handler middleware, matches err.code from sqlError
                    return next(err);
                }
                //valid res
                else return res.status(201).json({ promotionid: `${insertId}` })
            });
    });

app.get('/product/:id/promotions',
    function (req, res, next) {
        var productid = req.params.id;

        promotion.getIdProductPromotions(productid,
            function (err, result) {
                if (err) {//passes to err handler middleware, matches err.code from sqlError
                    return next(err)
                }
                else if (!result)
                    return res.status(404).json({ message: `Product ${productid} has no active promotions` })
                //valid res with array
                else return res.status(200).json(result)
            })
    });

app.get('/product/:id/promotions/upcoming',
    function (req, res, next) {
        var productid = req.params.id;

        promotion.getIdProductUpcomingPromotions(productid,
            function (err, result) {
                if (err) {//passes to err handler middleware, matches err.code from sqlError
                    return next(err)
                }
                else if (!result)
                    return res.status(404).json({ message: `Product ${productid} has no upcoming promotions` })
                //valid res with array
                else return res.status(200).json(result)
            })
    });

app.delete('/promotion/:id/',
    function (req, res, next) {
        var promotionid = req.params.productid;

        promotion.deleteIdPromotion(promotionid,
            function (err, affectedRows) {
                if (err) {//passes to err handler middleware, matches err.code from sqlError
                    return next(err)
                }
                else if (!affectedRows) //if DELETE deleted no rows
                    return res.status(404).json({ message: `Promotion with id ${promotionid} not found` });
                //valid res
                else return res.sendStatus(204)
            });
    });


/**********auth endpoints  ***************/

// login endpoint
app.post('/user/login',
    function (req, res) {
        var { username, password } = req.body;

        user.loginUser(username, password, function (err, result) {
            if (err) {
                res.status(500);
                res.send(err.statusCode);
            }
            else if (!result) {
                res.status(404).json({ message: 'user not found' });
            }
            else {
                res.status(200).json(result)
            }
        });
    });

//checks if user is a valid login
app.get('/user/:id/verifyLogin',
    auth.verifyToken,
    function (req, res) {
        const tokenUserid = parseInt(req.userid);
        const pathUserid = parseInt(req.params.id);

        //because pathid is taken from localStorage and might be changed
        if (tokenUserid === pathUserid) {// if id from token and storage is the same
            return res.status(200).json({ auth: true, message: 'verifyLogin' });
        }
        else {
            return res.status(401).json({ auth: false, message: 'verifyLogin' });
        }
    });

//checks if user is an admin
app.get('/user/:id/verifyAdmin',
    auth.verifyToken,
    auth.verifyAdmin,
    function (req, res) {
        return res.status(200).json({ auth: true, message: 'verifyAdmin' });
    });

//to serve images
app.use('/images', express.static('images'));

//error handler that runs if request is invalid or mysql query returns an error
app.use(function (err, req, res, next) {
    console.log(err);

    switch (err.code) {
        //request integrity validation
        case 'invalid param id': return res.status(400).json({ message: `Invalid parameter id, please ensure id is a valid integer` })
        case 'invalid body keys': return res.status(400).json({ message: `Invalid request body, please ensure required keys are not empty` })

        //mysql errors
        case 'ER_DUP_ENTRY': return res.status(422).json({ message: `Entry already exists, please ensure unique fields don't reference existing records` })
        case 'ER_DATA_TOO_LONG': return res.status(422).json({ message: `One or more entries exceed maximum character length` })
        case 'WARN_DATA_TRUNCATED':
        case 'ER_WARN_DATA_OUT_OF_RANGE':
        case 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD': return res.status(422).json({ message: `One or more incorrect data types/ formats provided` })
        case 'ER_NO_REFERENCED_ROW_2': return res.status(422).json({ message: `One or more IDs provided don't match existing records` })
        default: return res.status(500).json({ message: `Unknown Error Occurred` })
    }
})



app.all('*', function (req, res) {
    res.status(504).json({ message: 'No endpoint hit' })
});


module.exports = app;


