import mongoose from "mongoose";

const postsSchema = new mongoose.Schema({
  
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    body:{
        type:String,
        required:true
    },
    likes:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    media:{
        type:String,
        default:""
    },
    active:{    //this is mainly for when a user posted some wrong conetent then admin should have power to delete that post  which make the active flag as false 
        type:Boolean,
        default:true
    },
    filetype:{
        type:String,
        default:""
    },
    likedBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }]
    
});

const Posts = mongoose.model("Posts", postsSchema);

export default Posts;