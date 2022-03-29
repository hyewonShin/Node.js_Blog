const express  = require("express");
const router = express.Router(); //exprees에서 제공하는 Router함수를 사용해 Router을 생성한다.
const Blog = require("../schemas/blog"); // "./" = 현재 내 위치 / "../" = 내 위치에서 한단계 위
const { send } = require("express/lib/response"); //응답해주는 역할을 하는 library
const jwt = require("jsonwebtoken"); //jwt 모듈 불러오기 
const res = require("express/lib/response");
const authMiddleware = require("../routes/auth-middleware");

router.get("/", (req, res) => {
    res.send("this is router page");
});

//게시글 목록조회 페이지 연결
router.get('/list', (req, res) => {
  res.render('list');
})

//게시글 작성 페이지 연결
router.get('/write', async(req, res) => {
  res.render('write');
})

//게시글 상세 조회 연결
router.get('/list_Detail', async(req, res) => {
  res.render('list_Detail');
})

//수정 페이지 연결 
router.get('/modify', async(req, res) => {
  res.render('modify');
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
router.post('/blogList', authMiddleware, async (req, res) => {
  //작성한 정보 가져옴
  const { borderDate, subject, nick, password_write, content } = req.body;
  console.log(borderDate, subject, nick, password_write, content); // ok

  //유효성 검사
  isExist = await Blog.find({ borderDate });
  if (isExist.length == 0) {
    await Blog.create({ borderDate, subject, nick, password_write, content });
  }
  res.send({ result: "success" });
});



// 수정 페이지
router.patch("/blogList/:borderDate", authMiddleware, async (req, res) => {
 
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



// 태성님 코드 //
// 댓글 >> DB로 올리기 (완료)
router.post("/postingComment", authMiddleware, async (req, res) => {
  const { Comment, PostId } = req.body

  if (!Comment.length) {
      return res.json({ msg: "댓글 내용이 없습니다. 작성후 등록해 주세요." })
    }

  // 사용자 브라우저에서 보낸 쿠키를 인증미들웨어통해 user변수 생성
  const { user } = res.locals // NickName: ##, Pw: ##, _id: ##
  
  // 현재시간으로 댓글의 ID 생성
  const moment = require('moment'); 
  require('moment-timezone'); 
  moment.tz.setDefault("Asia/Seoul"); 
  const NowDate = String(moment().format('YYYY-MM-DD HH:mm:ss')); 
  const CommentId = CryptoJS.SHA256(NowDate)['words'][0];

  // 해당 댓글의 ID가 DB에 있는지 조회
  const existCommentId = await CommentDB.find({ CommentId });
  // const UserId = user._id.toString()
  const UserId = user.NickName

  // 같은 댓글 ID가 DB에 있다면 오류발생 
  if (existCommentId.length) {
      return res.json({ msg: "예상치 못한 오류입니다." })
    }

  res.json({ msg: "댓글이 등록이 완료되었습니다!" })
  await CommentDB.create({ NowDate, Comment, CommentId, PostId, UserId });
})

// DB >> 댓글 내려주기
router.get("/lookupComment", async (req, res) => {
  const PostId = req.query.PostId;
  const comment_info = await CommentDB.find({ PostId });
  const sorted_total_ls = comment_info.sort( (a, b) => a.NowDate > b.NowDate ? -1 : 1)
  res.json(sorted_total_ls);
})

// 댓글 수정버튼 누르면 인증미들웨어로 보내서 검증하기
router.post("/updateCommentAuth", authMiddleware, async (req, res) => {
  // const { CommentId, PostId } = req.body

  // 사용자 브라우저에서 보낸 쿠키를 인증미들웨어통해 user변수 생성
  // const { user } = res.locals // NickName: ##, Pw: ##, _id: ##
  
  // console.log({ CommentId, PostId, user })
  res.send("인정합니당")
})

// 댓글 수정페이지html 내려주기
router.get("/updateComment", (req, res) => {
  const path = require("path")
  res.sendFile(path.join(__dirname + '/../public/updateComment.html'))
})

// 댓글 수정전 원본데이터 내려주기
router.get("/updateCommentData", async (req, res) => {
  const PostId = req.query.PostId;
  const CommentId = req.query.CommentId;
  const Comment_info = await CommentDB.find({$and: [{PostId, CommentId}] });
 
  res.json(Comment_info);
});

// 댓글 수정하기
router.post("/updateComment", async (req, res) => {
  const { CommentId, PostId, Comment } = req.body

  // 현재시간 생성
  const moment = require('moment'); 
  require('moment-timezone'); 
  moment.tz.setDefault("Asia/Seoul"); 
  const NowDate = String(moment().format('YYYY-MM-DD HH:mm:ss')); 

  // CommentId와 PostId를 기준으로 Data 받아오기
  const exist_PostId_CommentId = await CommentDB.find({$and: [{PostId, CommentId}] });
  
  // PostId와 Pw가 일치하는 Data가 없을경우
  if (exist_PostId_CommentId.length === 0) {
      return res.json({msg: "본인의 댓글이 아닙니다."})
  }

  res.json({msg: "댓글 수정이 완료되었습니다."})
  await CommentDB.updateOne({ CommentId }, { $set: { Comment, NowDate} } )
  
})

// 댓글 삭제하기
router.post("/deleteComment", async (req, res) => {
  const { CommentId, PostId, Comment } = req.body

  // 현재시간 생성
  const moment = require('moment'); 
  require('moment-timezone'); 
  moment.tz.setDefault("Asia/Seoul"); 
  const NowDate = String(moment().format('YYYY-MM-DD HH:mm:ss')); 

  // CommentId와 PostId를 기준으로 Data 받아오기
  const exist_PostId_CommentId = await CommentDB.find({$and: [{PostId, CommentId}] });
  
  // PostId와 Pw가 일치하는 Data가 없을경우
  if (exist_PostId_CommentId.length === 0) {
      return res.json({msg: "본인의 댓글이 아닙니다."})
  }

  res.json({msg: "댓글 삭제가 완료되었습니다."})
  await CommentDB.deleteOne({ CommentId } )
  
})



// app.js에서 사용하기위해 밖으로 내보내줌.
  module.exports = router;


//REST API의 설계 가이드
//리소스에 대한 행위는 HTTP Method(POST, GET, PUT, DELETE)로 표현해야 합니다.
//RESTful API는 REST API 설계 가이드를 따라 API를 만드는것 입니다.