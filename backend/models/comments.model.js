import mongoose from "mongoose";


const commentsSchema = new mongoose.Schema({
    postId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Posts"
    },
    userId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    body:
    {
        type:String,
        required:true
    }

}, { timestamps: true });

const Comments = mongoose.model("Comments", commentsSchema);

export default Comments;
