const jwt = require("jsonwebtoken")  //jwt 모듈 불러오기 
const User = require("../schemas/user")


module.exports = (req, res, next) => {

    // 프런트앤드에서 로그인이 성공했을때 받은토큰을 아래와 같은 양식으로 
    // HTTP header에 넣어서 다시 서버로 보낸다. 
    // Authorization: Bearer JWT토큰내용

    //프런트엔드에서 대문자로 보내도 소문자로 받음.
    //headers 안에 head가 포함되어 있다.
   // const { authorization } = req.headers;
    const tokenValue = req.cookies.token;
   //console.log(tokenValue); //ok


    try {
        const { userId }  = jwt.verify(tokenValue, "seceret_my_key");

        //db연결
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


