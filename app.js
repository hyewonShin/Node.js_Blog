const http = require('http');
const express = require('express');
const app = express();
const ejs = require('ejs');
const connect = require("./schemas");

const port = 9000;
connect();


const server = http.createServer(app);
//const hostname = '13.125.160.60';


// ejs 설정 
app.set('view engine', 'ejs');
app.set('views', './views');


 const requestMiddleware = (req, res, next) => {  //requestMiddleware 미들웨어를 따로 함수처리하여 분리시켜 줌.
    console.log("Request URL:", req.originalUrl," - ",new Date());
    next();  //next()가 없으면 무한루프에 걸린다 //send메세지가 있을 땐 next()함수를 안써도 된다. 
};



// 에가 없으면 값이 undifind로 넘어간다.
app.use(express.urlencoded({ extended: false })); 

//body에 들어오는 json데이터를 parsing해주는 미들웨어
app.use(express.json());

 //미들웨어(get.use)
app.use(requestMiddleware);

//순서가 중요하다! 달라지면 에러남.
const blogRouter = require("./routes/blog");   
app.use("/blog", blogRouter); //요청이 맞을때 blogRouter 반환한다.
// get메서드와 주소가 같을 시, 미들웨어 응답이 가로채서 먼저 나오게 된다.
// express에서는 라우터를 미들웨어로 처리한다.


//GET이라는 HTTP메서드로 아래 경로로 요청이 들어왔다.(app.get)
app.get('/', (req, res) => {
    res.send("this is 루트 page");
});

//서버를 켜는 코드(app.listen)
server.listen(port, hostname, () => {
    //console.log(`Server running at http://${hostname}:${port}/`);
});





// REST API 
// - routes 주소 : /blog

// 1) 글작성 페이지 /write
// - 글쓰기버튼 함수  post_write()

// 2) 글목록 페이지 /list
// - 글목록 불러오는 함수 get_detail()
// - 글목록 html추가 함수 make_list()

// 3) 글상세 페이지 /list_Detail
// - 수정화면으로 가는 버튼 modify_detail()
// - 삭제 유효성검사 버튼 remove_validation()

// 4) 글수정 페이지 /modify
// - 수정 유효성검사 함수 modify_validation()
// - 수정함수 modify()






