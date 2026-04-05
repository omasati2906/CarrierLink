import mongoose from "mongoose";
import User from "./models/user.model.js";
import Post from "./models/posts.model.js";
import dotenv from "dotenv";

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'username profilePicture');
        console.log("Users:", JSON.stringify(users, null, 2));

        const posts = await Post.find({ media: { $ne: "" } }, 'body media');
        console.log("Posts with media:", JSON.stringify(posts, null, 2));

        await mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error);
    }
};

checkData();
