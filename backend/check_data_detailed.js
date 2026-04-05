import mongoose from "mongoose";
import User from "./models/user.model.js";
import Post from "./models/posts.model.js";
import dotenv from "dotenv";

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'username profilePicture');
        console.log("Users and their profile pictures:");
        users.forEach(u => console.log(`${u.username}: ${u.profilePicture}`));

        const posts = await Post.find({ media: { $ne: "" } }, 'body media');
        console.log("\nPosts and their media:");
        posts.forEach(p => console.log(`Post: ${p.body.substring(0, 20)}... Media: ${p.media}`));

        await mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error);
    }
};

checkData();
