const express  = require("express");
const router = express.Router(); //exprees에서 제공하는 Router함수를 사용해 Router을 생성한다.
const Blog = require("../schemas/blog"); // "./" = 현재 내 위치 / "../" = 내 위치에서 한단계 위
const Comment = require("../schemas/comment"); 
const { send } = require("express/lib/response"); //응답해주는 역할을 하는 library
const res = require("express/lib/response");
const authMiddleware = require("../routes/auth-middleware");
const CryptoJS = require("crypto-js");


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

//게시글 수정 페이지 연결 
router.get('/modify', async(req, res) => {
  res.render('modify');
})

//댓글 수정 페이지 연결 
router.get('/modifyComment', async(req, res) => {
  res.render('modifyComment');
})








// 게시글 목록 조회 
router.get("/blogList", async (req, res, next) => {

  try {
    const blogList = await Blog.find({}).sort("-NowDate");
    res.json({ blogList });
  } catch (err) {
    console.error(err);
    next(err);
  } 
}); 




 //상세조회 페이지 
 router.get("/blogList/:PostId",async (req, res) => {
  //주소에 PostId를 파라미터값으로 가져옴
  const { PostId }  = req.params;
  //console.log(PostId); //ok 

  blogList = await Blog.findOne({PostId});
  //detail 값으로 넘겨줌
  res.json({ blogList: blogList });
});




// 게시글 작성 페이지 //저장됌 
router.post('/blogList', authMiddleware, async (req, res) => {
  //작성한 정보 가져옴
  const { subject, nick, password_write, content } = req.body;
  //console.log(borderDate, subject, nick, password_write, content); // ok

// 사용자 브라우저에서 보낸 쿠키를 인증미들웨어통해 user변수 생성
  const { user } = res.locals 
 //console.log(user)  //ok

  const moment = require('moment'); 
  require('moment-timezone'); 
  moment.tz.setDefault("Asia/Seoul"); 
  const NowDate = String(moment().format('YYYY-MM-DD HH:mm:ss')); 

  //현재시각을 암호화하여 PostId생성 
  const PostId = CryptoJS.SHA256(NowDate)['words'][0];
  //console.log(PostId) //ok

  // 해당 댓글의 ID가 DB에 있는지 조회
  const existPostId = await Blog.find({ PostId });
  // const UserId = user._id.toString()
  const UserId = user.id
 // console.log(UserId) //ok

  //유효성 검사
  if (existPostId.length == 0) {
    await Blog.create({ NowDate, PostId, subject, content, nick, password_write, UserId });
  }
  res.send({ result: "success" });
});




// 수정 페이지
router.patch("/blogList/:PostId", authMiddleware,async (req, res) => {
 
  const { PostId } = req.params;
  const { nick, subject, content } = req.body;
  //console.log(userId) //ok 

  //게시글 내용이 없으면 저장되지 않고 alert 뜨게하기. 
   if (!content.length) {
    res.status(401).send();  //401 : 인증실패
    return;
  }

  isBorder = await Blog.find({ PostId });
  if (isBorder.length) {
    await Blog.updateOne({ PostId }, { $set: { nick, subject, content } });
  }
  res.send({ result: "success" });
})




// 게시글 삭제 
router.delete("/blogList/:PostId", authMiddleware, async (req, res) => {
  const { PostId } = req.params;
  const isBorder = await Blog.find({ PostId });
  if (isBorder.length > 0) {
    await Blog.deleteOne({ PostId });
  }
  res.send({ result: "success" });
});




// 댓글 >> DB로 올리기 (완료)
router.post("/postingComment", authMiddleware, async (req, res) => {
  const { comment, PostId } = req.body
  //console.log(comment, PostId); //ok

  if (!comment.length) {
      return res.json({ msg: "댓글 내용이 없습니다. 작성후 등록해 주세요." }) //ok
    }

  // 사용자 브라우저에서 보낸 쿠키를 인증미들웨어통해 user변수 생성
  const { user } = res.locals // NickName: ##, Pw: ##, _id: ##
  //console.log(user); //ok
  
  // 현재시간으로 댓글의 ID 생성
  const moment = require('moment'); 
  require('moment-timezone'); 
  moment.tz.setDefault("Asia/Seoul"); 
  const NowDate = String(moment().format('YYYY-MM-DD HH:mm:ss'));  
  const CommentId = CryptoJS.SHA256(NowDate)['words'][0];
  //console.log(NowDate) //OK  
  //console.log(CommentId);  //ok

  // 해당 댓글의 ID가 DB에 있는지 조회
  const existCommentId = await Comment.find({ CommentId });
  // const UserId = user._id.toString()
  const UserId = user.id

  // 같은 댓글 ID가 DB에 있다면 오류발생 
  if (existCommentId.length) {
      return res.json({ msg: "예상치 못한 오류입니다." })
    }

  res.json({ msg: "댓글 등록이 완료되었습니다!" })
  await Comment.create({ NowDate, comment, CommentId, PostId, UserId });
})




// DB >> 댓글 보여주기
router.get("/lookupComment/:PostId", async (req, res) => {
    //주소에 PostId를 파라미터값으로 가져옴
    const { PostId }  = req.params;
  //const PostId = req.query.PostId; //쿼리문으로 받으면 모든 포스트에 동일한 댓글이 보임.
  const comment_info = await Comment.find({ PostId });
  const sorted_total_ls = comment_info.sort( (a, b) => a.NowDate > b.NowDate ? -1 : 1)
  res.json(sorted_total_ls);
})


// 댓글 수정전 원본데이터 내려주기
router.get("/updateCommentData", async (req, res) => {

   const PostId = req.query.PostId;
   const CommentId = req.query.CommentId;

 // console.log(PostId);  //ok
 // console.log(Comment)   //ok

  const Comment_info = await Comment.find({$and: [{PostId, CommentId}] });
 // console.log(Comment_info) //ok
  res.json(Comment_info);
});



// 댓글 수정하기
router.post("/updateComment", async (req, res) => {
  const { CommentId, PostId, comment } = req.body

  if (!comment.length) {
    return res.json({ msg: "댓글 내용이 없습니다. 작성후 등록해 주세요." }) //ok
  }

  //console.log(CommentId, PostId, comment)  //ok

  // 현재시간 생성(댓글 수정시간)
  const moment = require('moment'); 
  require('moment-timezone'); 
  moment.tz.setDefault("Asia/Seoul"); 
  const NowDate = String(moment().format('YYYY-MM-DD HH:mm:ss')); 

  // CommentId와 PostId를 기준으로 Data 받아오기
  const exist_PostId_CommentId = await Comment.find({$and: [{PostId, CommentId}] });
  
  // PostId와 CommentId가 일치하는 Data가 없을경우
  if (exist_PostId_CommentId.length === 0) {
      return res.json({msg: "본인의 댓글이 아닙니다."})
  }

  res.json({msg: "댓글 수정이 완료되었습니다."})
  await Comment.updateOne({ CommentId }, { $set: { comment, NowDate} } )
  
})




// 댓글 삭제하기
router.post("/deleteComment", async (req, res) => {
  const { CommentId, PostId, comment } = req.body

  // 현재시간 생성
  const moment = require('moment'); 
  require('moment-timezone'); 
  moment.tz.setDefault("Asia/Seoul"); 
  const NowDate = String(moment().format('YYYY-MM-DD HH:mm:ss')); 

  // CommentId와 PostId를 기준으로 Data 받아오기
  const exist_PostId_CommentId = await Comment.find({$and: [{PostId, CommentId}] });
  
  // PostId와 Pw가 일치하는 Data가 없을경우
  if (exist_PostId_CommentId.length === 0) {
      return res.json({msg: "본인의 댓글이 아닙니다."})
  }

  res.json({msg: "댓글 삭제가 완료되었습니다."})
  await Comment.deleteOne({ CommentId } )
  
})


// app.js에서 사용하기위해 밖으로 내보내줌.
  module.exports = router;


//REST API의 설계 가이드
//리소스에 대한 행위는 HTTP Method(POST, GET, PUT, DELETE)로 표현해야 합니다.
//RESTful API는 REST API 설계 가이드를 따라 API를 만드는것 입니다.