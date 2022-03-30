const mongoose = require("mongoose");


const commentSchema = mongoose.Schema({
    comment: {
        type: String,
        
    },
    CommentId: {
        type: String,
        required: true,
        //unique: true,
    },
    UserId: {
        type: String,
        required: true,
    },
    PostId: {
        type: String,
        required: true,
    },
    NowDate: {
        type: String,
        required: true,
    }
});


module.exports = mongoose.model("Comment", commentSchema);

