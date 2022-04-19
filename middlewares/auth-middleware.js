const jwt = require("jsonwebtoken")  //jwt 모듈 불러오기 
const User = require("../schemas/user")
const fs = require("fs");
require("dotenv").config();

module.exports = (req, res, next) => {
    try {
        const {authorization} = req.headers;
        const [tokenType, tokenValue] = authorization.split(' ');
        //console.log(authorization)
        if (tokenType !== 'Bearer') {
            res.status(401).send({
                errorMessage: "로그인 후 사용하세요.",
            });
            return;
        }
        const {userId} = jwt.verify(tokenValue, process.env.key);
        //console.log(userId)
        User.findOne({ userId })
            .then((user) => {
             res.locals.user = user;
             next();
            });
    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요.",
        });
        return;
    }
};


