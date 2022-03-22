const express  = require("express");
const Blog = require("../schemas/blog") // "./" = 현재 내 위치 / "../" = 내 위치에서 한단계 위
const { send } = require("express/lib/response");
const blog = require("../schemas/blog");
const router = express.Router(); 

router.get("/", (req, res) => {
    res.send("this is router page");
});


//글작성목록조회
router.get('/list', (req, res) => {
  res.render('list');
})

//글작성 페이지  
router.get('/write', async(req, res) => {
  res.render('write');
})



// 게시글 목록 조회
router.get("/blogList", async (req, res, next) => {

    const blogList = await Blog.find();
    //res.json({ blogList: blogList });  //되는 코드 
    
    res.render({blogList : {blogList}});

  // try {
  //   const { borderDate } = req.query;
  //   console.log(borderDate);
  //   const blogList = await Blog.find({ borderDate }).sort("-borderDate");
  //   res.json({ blogList: blogList });
  // } catch (err) {
  //   console.error(err);
  //   next(err);
  // } 
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




  module.exports = router;






// router.post('/blogList', async (req, res) => {
//   //작성한 정보 가져옴
//   const { borderDate, subject, nick, password, content } = req.body;
//   //유효성 검사
//   isExist = await Blog.find({ borderDate });
//   if (isExist.length == 0) {
//     await Blog.create({ borderDate, subject, nick, password, content });
//   }
//   res.send({ result: "success" });
// });





  
//   export const Blog = async (req, res) => {
//     const { borderDate, subject, nick, password, content } = req.body;
//     const post = new Blog({
//       borderDate : borderDate,  
//       subject : subject,
//       nick : nick,
//       password : password,
//       content : content
//     });
//     await post.save();
//     return res.redirect("/");
//   };
  
  

  
  
//   //작성한 정보 가져옴
//   const { borderDate, subject, nick, password, content } = req.body;

  


//   //해당 페이지의 router들을 module로 내보내겠다. 
//   module.exports = router;



// //상품생성API
// router.post("/write", async (req, res)=>{
//     // const goodsId = req.body.goodsId;
//     //비할당구조화 
//     //원하는 property를 한번에 변수로 할당하여 사용할 수 있다.
   
//     const { subject, nick, password, content} = req.body;
  
//     const blog = await Blog.find({ nick }); //요청받은 id를 기존db에 넣는다.
//       if(blog.length) { //이미 있는 id일때 
//         return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다."})
//       }
//       //creat : 모델을 생성하면서 insert까지 해주는 함수.
//       const createdBlog = await Blog.create({ subject, nick, password, content })
  
//     res.json({ blog : createdBlog });
//   });
  

// // 브라우저와 서버간의 통신이기 때문에 Restful API이다. 
// // async를 사용하여 비동기함수로 바꿔준다.
// router.get("/goods", async(req, res) => {
//     const goods = await Goods.find(); //모델에서 목록 가져오기 
//     res.json({
//         //key와 값이 동일한 이름이면 key이름만 적어줘도 된다.(객체 초기자)
//         goods,  // == goods : goods // , 의 존재유무는 별 의미가 없다.
//     })[0];
// });


// // /goods/1234
// router.get("/goods/:goodsId", async(req,res) => {
//     const { goodsId } = req.params; //url에 입력된 goodId값 가져옴.
//     //uri는 항상 문자열이라서 가져올 때도 문자형이다. 
//     //그래서 아래에서 goodsId의 값을 비교해줄 때 int형으로 바꿔줘야된다.
//     //json에 들어있는 값의 형태는 정수형이기 때문이다.
   
//    const {detail} = await Goods.find({ goodsId: Number(goodsId)});
//  //find는 항상 배열이다 그래서 { }을 사용하여 destructuring(비구조화) 해준다
  
//    res.json({
//           detail,  // detail: detail, (객체 초기자)
//     });

//     //console.log(goodsId)
//     //서버에서 test용으로라도 응답해주지 않으면 무한루프에 걸린다.
//     //서버의 본질적인 임무가 값을 보낸느 것이기에. 
//     //res.send("good id 확인용"); //화면에 텍스트가 출력된다.
// });



//REST API의 설계 가이드
//리소스에 대한 행위는 HTTP Method(POST, GET, PUT, DELETE)로 표현해야 합니다.
//RESTful API는 REST API 설계 가이드를 따라 API를 만드는것 입니다.