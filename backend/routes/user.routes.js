import { Router } from "express";
import { register,login,uploadProfilePicture,updateUserProfile,getUserProfile,udpdateProfileData,getAllUserProfile,downloadProfile ,acceptConnectionRequest,sendConnectionRequest,ToWhomIHaveSentConnectionRequests,WhoSentMeConnectionRequests,getUserProfileAndUserBasedOnUsername,findConnections} from "../controllers/user.controller.js";

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


router.route("/update_profile_picture").post(upload.single("profile_Picture"),uploadProfilePicture);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserProfile);

router.route("/get_user_and_profile").get(getUserProfile);
router.route("/update_profile_data").post(udpdateProfileData);
router.route("/get_all_user_profile").get(getAllUserProfile);

router.route("/find_connections").get(findConnections);

router.route("/get_user_profile_and_user_based_on_username").get(getUserProfileAndUserBasedOnUsername);

router.route("/download_resume/:id").get(downloadProfile);

router.route("/send_connection_request").post(sendConnectionRequest); 
router.route("/accept_connection_request").post(acceptConnectionRequest);
router.route("/get_my_connection_requests").get(ToWhomIHaveSentConnectionRequests);
router.route("/get_who_sent_me_connection_requests").get(WhoSentMeConnectionRequests);
export default router;