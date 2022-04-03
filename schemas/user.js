const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    id: { //회원가입/로그인시 사용 
        type: String,
        required: true, //필수적이어야 된다. 
       // unique: true,  //id이기 때문에 유니크(유일)해야된다.
    },
    password: {
        type: String,
        required: true, //필수적이어야 된다. 
       // unique: true,  //id이기 때문에 유니크(유일)해야된다.
    },
});
userSchema.virtual("userId").get(function () {
    return this._id.toHexString();
});
userSchema.set("toJSON", {
    virtuals: true,
});


module.exports = mongoose.model("User", userSchema);

