const express = require("express");
const router = express.Router(); //exprees에서 제공하는 Router함수를 사용해 Router을 생성한다.
const User = require("../schemas/user") // "./" = 현재 내 위치 / "../" = 내 위치에서 한단계 위
const { send } = require("express/lib/response"); //응답해주는 역할을 하는 library
const jwt = require("jsonwebtoken")
const authMiddleware = require("../routes/auth-middleware");
const res = require("express/lib/response");



//로그인 페이지 연걸
router.get('/login', (req, res) => {
    res.render('login');
});

//회원가입 페이지 연결 
router.get('/sign_up', async (req, res) => {
    res.render('sign_up');
});




//회원가입
router.post("/users", async (req, res) => {
    //회원가입창(프런트앤드)에서 받아오는 값 
    const { userDate, id, password, password2 } = req.body;

    console.log(userDate, id, password, password2); //값 넘어옴

    if (password !== password2) {
        res.status(400).send({ //400 status 코드 보내기 
            errorMessage: "비밀번호가 일치하지 않습니다.",
        });
        //유효성 검사 후 아래 코드 실행하지 못하도록 return 사용. 
        return;
    }

    //or 조건식을 사용하여 닉네임이나 이메일이 db에 있는지 확인. 
    const existUsers = await User.find({
        // $or: [{nick},{[nickname]}], 
        id,
    });
    if (existUsers.length) { //사용자의 정보가 db에 존재한다면
        res.status(400).send({
            errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
        });
        return;
    }
    //이전에 가입한 정보가 없다면, user변수에 저장(회원가입)
    const user = new User({ userDate, id, password });
    await user.save(); //user변수 db에 저장

    //새로운 데이터가 생성되었으므로 201 status값 반환해준다.
    res.status(201).send({});
});




//로그인(토큰생성)
router.post("/auth", async (req, res) => {
    const { id, password } = req.body;
    console.log(id, password); //값 들어옴 

    //exec() 메소드는 일치 검색을 실행합니다. 결과 배열 또는 null 을 반환합니다 .
    const user = await User.findOne({ id }).exec();
    console.log(user); // 값 들어옴 

    if (!user) {  //사용자가 없다면 
        res.status(401).send({  //401 : 인증실패 
            errorMessage: '이메일 또는 패스워드가 잘못되었습니다.',
        }); //OK
        return;
    }
    // 사용자가 있다면 
    // sign을 해야 토큰을 만들 수 있다.
    // userId는 models에서 만들어준 가상의 값.
    // const token = jwt.sign({ userId: user.userId }, "my_seceret_key");
    // console.log(token);
    // 문제 없으면 토큰 발급 

    //수업
    // res.send({
    //     token: jwt.sign({ userId: user.userId }, "customized-secret-key"),
    //   });
    // });

    //태성님 
//     const token = jwt.sign(payload, secret, options);
//     res.cookie('token', token).send({msg: "로그인이 완료 되었습니다."})
//    },)

res.cookie({
    token: jwt.sign({ userId: user.userId }, "seceret_my_key"),
  });
});



//미들웨어 구현
router.post("/authUser", authMiddleware, async (req, res) => {
    const { user } = res.locals; //인증된 토큰의 user값 
    //console.log(user);
    console.log(res.locals); //locals는 저장공간의 이름이다. 이미 user의 정보를 저장했으니 공간이름만 불러도 저장된 내용들이 출력된다.
    res.send({
        user,
    });
});


// app.js에서 사용하기위해 밖으로 내보내줌.
module.exports = router;

