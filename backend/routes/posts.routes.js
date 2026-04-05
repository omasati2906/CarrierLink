import { Router } from "express";
import { activecheck,createPost,getAllPosts,deletePost,commnetPost,getCommentsByPost,deleteCommentOfUser,incrementLikes,allUsersWhoLikedPost } from "../controllers/posts.controller.js";
import multer from "multer";


const router = Router();    

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "uploads/");
   },
   filename: function (req, file, cb) {
      cb(null,file.originalname);
   },
});

const upload=multer({storage:storage})

router.route("/").get(activecheck);

router.route("/create_post").post(upload.single("file"),createPost);

router.route("/get_all_posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment_post").post(commnetPost);
router.route("/get_comments_by_post").post(getCommentsByPost);
router.route("/delete_comment_of_user").delete(deleteCommentOfUser);
router.route("/increment_post_likes").post(incrementLikes);
router.route("/all_users_who_liked_post").post(allUsersWhoLikedPost);

export default router;