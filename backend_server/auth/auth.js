var jwt = require('jsonwebtoken');

var config = require('../config/config');

const auth = {
    verifyToken: function (req, res, next) {
        console.log('verifying');

        var token = req.headers['authorization']; //retrieve authorization header’s content
        console.log(token)

        if (!token || !token.includes('Bearer')) { //process the token
            console.log('invalid token')
            return res.status(401).send({ auth: false, message: 'Not authorized!' });
        } else {
            token = token.split('Bearer ')[1]; //obtain the token’s value

            jwt.verify(token, config.key, function (err, decoded) {//verify token
                console.log(`token: ${decoded}`)
                if (err) {
                    console.log('bad auth');
                    return res.status(401).send({ auth: false, message: 'Not authorized!' });
                } else {
                    req.userid = decoded.userid; //decode the userid and store in req for use
                    req.type = decoded.type; //decode the role and store in req for use
                    console.log('token done')
                    next();
                }

            });
        }

    },

    verifyAdmin: function (req, res, next) {
        const tokenType = req.type;

        // console.log(tokenType);
        if (tokenType === 'Admin') {
            console.log('verified Admin');
            next();
        }
        else {
            console.log('Not admin');
            return res.status(403).json({ auth: false, message: 'Not admin' });
        }
    },
}

module.exports = auth;
