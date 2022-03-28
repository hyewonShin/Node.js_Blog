const jwt = require("jsonwebtoken")  //jwt 모듈 불러오기 
const User = require("../schemas/user")


module.exports = (req, res, next) => {

    // 프런트앤드에서 로그인이 성공했을때 받은토큰을 아래와 같은 양식으로 
    // HTTP header에 넣어서 다시 서버로 보낸다. 
    // Authorization: Bearer JWT토큰내용

    //프런트엔드에서 대문자로 보내도 소문자로 받음.
    //headers 안에 head가 포함되어 있다.
    const { authorization } = req.headers;

    //const tokenValue = req.cookies.token;



    const [tokenType, tokenValue] = authorization.split(' ');
    console.log(tokenType, tokenValue); //tokenType은 Bearer이다. 

    if (tokenType !== 'Bearer') { //Bearer가 아닐 때 
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요.'
        });
        return;  //Bearer 타입이 맞을 때 아래 try문 실행됌.
    }

    try {
        //jwt.verify() 함수 이용하여 토큰 유효성 확인.
        //유효성 확인 후 토큰생성시(sign) 만들어준 userId에 넣어줌.
        //decoded 값이 제대로 나온다는 것은 유효한 토큰이라는 뜻이다. 
        const { userId } = jwt.verify(tokenValue, "my_seceret_key");

        //해당 토큰이 유효성 확인이 된 것과 서버db에 존재하는지는 별개의 일.
        //db값 사용위해 User모델 불러옴(requeir 해주기).
        //토큰 안에 있는 userId 데이터로 해당 사용자가 데이터베이스에 존재하는지 체크 
        User.findById(userId).exec().then((user) => {
                //res.locals.
                //이 미들웨어를 사용하는 라우터에서는 굳이 데이터베이스에서 사용자 정보를 가져오지 않게 할 수 있다.
                //이렇게 담아둔 값은 정상적으로 응답 값을 보내고 나면 소멸하므로 해당 데이터가 어딘가에 남아있을 걱정의 여지를 남겨두지 않게 된다.
                //html/view 클라이언트 사이드로 변수들을 보낼 수 있으며, 그 변수들은 오로지 거기서만 사용할 수 있다.
                //렌더링시 중복되는 값들을 저장해놓고 계속해서 쓸 수 있다.
                res.locals.user = user; //user의 정보들을 저장해줌.
                next(); //미들웨어는 반드시 next를 호출해야된다.
            });
        } catch (error) { //복호화 에러가 났을 때:유효한 토큰이 아닐때/유효성확인 실패(인증실패) 
            res.status(401).send({
                errorMessage: '로그인 후 사용하세요.'
            });
            return;
        }
        //console.log(authorization);
        //console.log("여기를 지나쳤어요!");
};