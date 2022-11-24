require("dotenv");
const jwt = require('jsonwebtoken');

module.exports = {
    authorization: (req, res, next) => {
        let token = req.headers.authorization;
        if(token){
            token = token.split(" ")[1];
            jwt.verify(token,process.env.JWT_KEY, (error, result) => {
                if(
                    (error && error.name === "JsonWebTokenError") || (error && error.name === "TokenExpiredError")
                ){
                    res.send({
                        statusMessage: "Unauthorized",
                        statusCode: 401,
                    });
                } else {
                    if (result) {
                        console.log('ini data', result);
                        req.admin = result;
                        next();
                    }  else {
                        res.send({
                            statusMessage: "Unauthorized",
                            statusCode: 401,
                            data: { isSuccess: false},
                        });
                    }
                }
            });
        } else {
            res.send({
                statusMessage: "Unauthorized",
                statusCode: 401,
                data: { isSuccess: false},
            });
        }
    },
};