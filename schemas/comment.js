const mongoose = require("mongoose");


const commentSchema = mongoose.Schema({
    CommentId: {
        type: String,
        
    },
    comment: {
        type: String,
        
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
// commentSchema.virtual("CommentId").get(function () {
//     return this._id.toHexString();
// });
// commentSchema.set('toJSON', {
//     virtuals: true,
// });


module.exports = mongoose.model("Comment", commentSchema);

