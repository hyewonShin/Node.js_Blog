const express  = require("express");
const Blog = require("../schemas/blog") // "./" = 현재 내 위치 / "../" = 내 위치에서 한단계 위
const { send } = require("express/lib/response");
const blog = require("../schemas/blog");
const router = express.Router(); 

router.get("/", (req, res) => {
    res.send("this is router page");
});


//게시글 작성목록조회
router.get('/list', (req, res) => {
  res.render('list');
})

//게시글 작성 페이지  
router.get('/write', async(req, res) => {
  res.render('write');
})

//게시글 상세 조회 
router.get('/list_Detail', async(req, res) => {
  res.render('list_Detail');
})

//수정 페이지
router.get('/blogCorrect', async(req, res) => {
  res.render('blogCorrect');
})




// 게시글 목록 조회 
router.get("/blogList", async (req, res, next) => {

  try {
    const blogList = await Blog.find({}).sort("-borderDate");
    res.json({ blogList: blogList });
  } catch (err) {
    console.error(err);
    next(err);
  } 
}); 


//  상세조회 페이지 
router.get("/blogList/:borderDate", async (req, res) => {
  //주소에 borderDate가 파라미터값으로 가져옴
  const { borderDate } = req.params;
  blogList = await Blog.findOne({borderDate: borderDate});
  //detail 값으로 넘겨줌
  res.json({ blogList: blogList });
});



// 게시글 작성 페이지
router.post('/blogList', async (req, res) => {
  //작성한 정보 가져옴
  const { borderDate, subject, nick, password, content } = req.body;
  console.log(borderDate, subject, nick, password, content);

  //유효성 검사
  isExist = await Blog.find({ borderDate });
  if (isExist.length == 0) {
    await Blog.create({ borderDate, subject, nick, password, content });
  }
  res.send({ result: "success" });
});



// 수정 페이지
router.patch("/blogList/:borderDate", async (req, res) => {
 
  const { borderDate } = req.params;
  const { nick, subject, content } = req.body;

  isBorder = await Blog.find({ borderDate });
  if (isBorder.length) {
    await Blog.updateOne({ borderDate }, { $set: { nick, subject, content } });
  }
  res.send({ result: "success" });
})



// 게시글 삭제 
router.delete("/blogList/:borderDate", async (req, res) => {
  const { borderDate } = req.params;
  const isBorder = await Blog.find({ borderDate });
  if (isBorder.length > 0) {
    await Blog.deleteOne({ borderDate });
  }
  res.send({ result: "success" });
});



// app.js에서 사용하기위해 밖으로 내보내줌.
  module.exports = router;


//REST API의 설계 가이드
//리소스에 대한 행위는 HTTP Method(POST, GET, PUT, DELETE)로 표현해야 합니다.
//RESTful API는 REST API 설계 가이드를 따라 API를 만드는것 입니다.