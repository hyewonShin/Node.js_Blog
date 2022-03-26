const mongoose = require("mongoose"); //express.js 대신 사용


//mongoose를 이용해 DB에 연결.
const connect = () => {
    mongoose.connect('mongodb+srv://test:1234@cluster0.uwzfe.mongodb.net/Cluster0?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB conected'))  //성공시
    .catch((err)=>{                        
        console.error(err);                       //실패시 
    });
};

module.exports = connect; //내보내서 app.js에서 사용하기.


