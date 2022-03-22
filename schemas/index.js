const mongoose = require("mongoose"); //express.js 대신 사용


//mongoose 연결 
const connect = () => {
    mongoose.connect("비밀")
    .then(() => console.log('MongoDB conected'))
    .catch((err)=>{
        console.error(err);  
    });
};

module.exports = connect; //내보내서 app.js에서 사용하기.


