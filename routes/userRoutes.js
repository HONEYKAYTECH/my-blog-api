const express = require("express");
const { register, login, allUsers, singleUser, updateUser, deleteUser, profilePhotoUploadCtrl, whoViewedMyProfileCtrl, FollowingCtrl, UnfollowCtrl, UnFollowCtrl, blockedUserCtrl, UnBlockedCtrl, adminBlockUserCtrl, adminUnBlockUserCtrl, updateUserCtrl, updatePasswordCtrl, deleteUserCtrl, } = require("../controller/userCtrl");
const isLogin = require("../middlewares/isLogin");
const userRouter = express.Router();
const multer = require("multer");
const storage = require("../config/cloudinary");
const isAdmin = require("../middlewares/isAdmin");

//instance of multer
const upload = multer({storage})


userRouter.post("/register",register)
userRouter.post("/login",login)
userRouter.get("/",allUsers)
userRouter.get("/profile", isLogin, singleUser)
userRouter.put("/profile/:id",updateUser)
//GET/api/v1/users/profile-Viewers/:id
userRouter.get("/profile-viewers/:id", isLogin, whoViewedMyProfileCtrl)
userRouter.get("/following/:id", isLogin, FollowingCtrl)
userRouter.get("/unfollowing/:id", isLogin, UnFollowCtrl)
userRouter.get("/block/:id", isLogin, blockedUserCtrl)
userRouter.get("/unblock/:id", isLogin, UnBlockedCtrl)

//PUT/api/v1/users/admin-block/:id
userRouter.put("/admin-block/:id", isLogin, isAdmin, adminBlockUserCtrl);
userRouter.put("/admin-unblock/:id", isLogin, isAdmin, adminUnBlockUserCtrl);
userRouter.put("/update", isLogin, updateUserCtrl);
userRouter.put("/update-password", isLogin, updatePasswordCtrl);

// POST/api/v1/user/profile-photo-upload
userRouter.post("/profile-photo-upload",isLogin, upload.single("profile"),profilePhotoUploadCtrl);
// DELETE/api/v1/user/delete-user
userRouter.delete("/delete-user", isLogin,deleteUserCtrl)


module.exports = userRouter;