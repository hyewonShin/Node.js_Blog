const jwt = require("jsonwebtoken")  //jwt 모듈 불러오기 
const User = require("../schemas/user")


module.exports = (req, res, next) => {

    
    const tokenValue = req.cookies.token;
   //console.log(tokenValue); //ok


    try { //verify:유효성검사 성공하면 
        const { userId }  = jwt.verify(tokenValue, "seceret_my_key");

        //사용자가 db에 존재하는지 확인
        User.findById(userId).then((user) => {
            res.locals.user = user; 
           // console.log(res.locals.user); //ok
            next();
        })

    } catch (error) {
        console.log("로그인후 사용해주세요.")
        res.status(401).send("로그인 후 사용하세요");
        return;
    }
};


