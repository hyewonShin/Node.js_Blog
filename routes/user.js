const express = require("express");
const router = express.Router(); //exprees에서 제공하는 Router함수를 사용해 Router을 생성한다.
const User = require("../schemas/user"); // "./" = 현재 내 위치 / "../" = 내 위치에서 한단계 위
const { send } = require("express/lib/response"); //응답해주는 역할을 하는 library
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");
const authMiddleware = require("../routes/auth-middleware");



//회원가입 페이지 연결 
router.get('/sign_up', async (req, res) => {
    res.render('sign_up');
});


//로그인 페이지 연걸
router.get('/login', (req, res) => {
    res.render('login');
});




//회원가입
router.post("/users", async (req, res) => {
    //회원가입창(프런트앤드)에서 받아오는 값 
    const { id, password, password2 } = req.body;
    //console.log(id, password, password2); //값 넘어옴
    //아이디는 `최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)`로 구성하기
    const re_id = /^[a-zA-Z0-9]{3,10}$/;
    const re_password = /^[a-zA-Z0-9]{4,30}$/;


    if (password !== password2) {
        res.status(412).send({ //400 status 코드 보내기 
            errorMessage: "비밀번호가 일치하지 않습니다."
        });
        //유효성 검사 후 아래 코드 실행하지 못하도록 return 사용. 
        return;
    }  
    if (id.search(re_id) == -1) {
        res.status(412).send({
            errorMessage: "ID의 형식이 일치하지 않습니다."
        });
        return;
    }
    if (password.search(re_password) == -1) {
        res.status(412).send({
            errorMessage: "패스워드 형식이 일치하지 않습니다."
        });
        return;
    }
    if (password.search(id) != -1) {
            res.status(412).send({
                errorMessage: "패스워드에 닉네임이 포함되어 있습니다."
            });
            return;
        }

    //or 조건식을 사용하여 닉네임이나 이메일이 db에 있는지 확인. 
    const existUsers = await User.find({
        id,
    });
    if (existUsers.length) { //사용자의 정보가 db에 존재한다면
        res.status(400).send({
            errorMessage: "이미 가입된 아이디가 있습니다."
        });
        return;
    }
    //이전에 가입한 정보가 없다면, user변수에 저장(회원가입)
    const user = new User({ id, password });
    res.json({ msg: "회원가입이 완료 되었습니다." });
    await user.save(); //user변수 db에 저장

    //새로운 데이터가 생성되었으므로 201 status값 반환해준다.
    res.status(201).send();
});




//로그인 유효성 검사 및 토큰 발급 
router.post("/auth", async (req, res) => {
    const { id, password } = req.body;
     //console.log(id, password); //값 들어옴 

    //exec() 메소드는 일치 검색을 실행합니다. 결과 배열 또는 null 을 반환합니다 .
    // 클라가 입력한 정보로 DB조회 
    const user = await User.findOne({ id }, {password}).exec();
    // console.log(user); // 값 들어옴 

    if (!user) {  //사용자가 없다면 
        res.status(401).send();  //401 : 인증실패
        return;
    }
    const token = jwt.sign({ userId: user.userId }, "seceret_my_key");
    //응답값으로 클라에게 토큰 생성해서 보내줌 
    res.send({token});
});



router.get('/me', authMiddleware, async (req, res) => {
    try {
        const {user} = res.locals;
        //console.log(user)
        //미들웨어 통과시 사용자정보를 클라에게 전달한다. 
        res.send({user});  
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(400).send(
            {errorMessage: "사용자 정보를 가져오지 못하였습니다."}
        );
        return;
    }
});

module.exports = router;