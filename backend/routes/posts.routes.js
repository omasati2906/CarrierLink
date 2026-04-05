import { Router } from "express";
import { activecheck,createPost,getAllPosts,deletePost,commnetPost,getCommentsByPost,deleteCommentOfUser,incrementLikes,allUsersWhoLikedPost } from "../controllers/posts.controller.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = Router();

const storage = new CloudinaryStorage({
   cloudinary: cloudinary,
   params: async (req, file) => ({
      folder: "careerlink/posts",
      resource_type: "auto",         // supports both images and videos
      allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "mov", "webm"],
   }),
});

const upload = multer({ storage });

router.route("/").get(activecheck);

router.route("/create_post").post(upload.single("file"), createPost);

router.route("/get_all_posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment_post").post(commnetPost);
router.route("/get_comments_by_post").post(getCommentsByPost);
router.route("/delete_comment_of_user").delete(deleteCommentOfUser);
router.route("/increment_post_likes").post(incrementLikes);
router.route("/all_users_who_liked_post").post(allUsersWhoLikedPost);

export default router;