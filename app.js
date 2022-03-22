const http = require('http');
const express = require('express');
const app = express();
const ejs = require('ejs');
const connect = require("./schemas");


const port = 7000;
connect();


const server = http.createServer(app);
const hostname = '127.0.0.1';


// ejs 설정 
app.set('view engine', 'ejs');
app.set('views', './views');


 const blogRouter = require("./routes/blog");  //require 페이지에 있는 goods 파일을 가져옴.

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




app.use("/api", blogRouter); //요청이 맞을때 goodRouter페이지를 반환한다.
// get메서드와 주소가 같을 시, 미들웨어 응답이 가로채서 먼저 나오게 된다.
// express에서는 라우터를 미들웨어로 처리한다.



//GET이라는 HTTP메서드로 아래 경로로 요청이 들어왔다.(app.get)
app.get('/', (req, res) => {
    res.send("this is 루트 page");
});



//서버를 켜는 코드(app.listen)
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});






