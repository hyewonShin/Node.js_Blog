const mongoose = require("mongoose");
// mongodb에는 schema가 없다. 하지만 mongoose에서 
// mongo사용의 편의를 위해서 schema를 제공하고 있다. 


//model 정해주기 // 각 카테고리가 유형에 맞는지 검사해준다.
const blogSchema = mongoose.Schema({
    borderDate: {
        type: Date,
    },
    subject: {
        type: String,
        required: true, //필수적이어야 된다. 
    },
    nick: {
        type: String,
    },
    password: {
        type: String,
        required: true, //필수적이어야 된다. 
        unique: true,  //id이기 때문에 유니크(유일)해야된다.
    },
    content: {
        type: String,
    },
});


// model에 담아서 exports를 사용해 밖으로 내보내준다.
// key값의 첫글자를 대문자로 해야된다(model임을 식별하기 위한 약속)
module.exports = mongoose.model("Blog", blogSchema);


//스키마는, 해당 컬렉션의 문서에 어떤 종류의 값이 들어가는지를 정의합니다.
//모델은 스키마를 통해서 만드는 인스턴스입니다.