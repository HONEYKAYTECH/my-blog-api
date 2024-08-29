const express = require("express");
const {  allPost, singlePost, updatePost, deletePost, createPostCtrl, fetchPostCtrl, toggleLikesPostCtrl, toggleDisLikesPostCtrl, postDetailsCtrl } = require("../controller/postCtrl");
const isLogin = require("../middlewares/isLogin");
const isAdmin = require("../middlewares/isAdmin");
const storage = require("../config/cloudinary");
const multer = require("multer");
const postRouter = express.Router();


//instance of multer
const upload = multer({storage});

postRouter.post("/", isLogin, createPostCtrl)
postRouter.get("/",isLogin, fetchPostCtrl)
postRouter.get("/likes/:id",isLogin,toggleLikesPostCtrl)
postRouter.get("/dislikes/:id",isLogin, toggleDisLikesPostCtrl)
postRouter.get("/:id",isLogin, postDetailsCtrl)
postRouter.get("/:id",isLogin, singlePost)
postRouter.put("/:id",isLogin, upload.single("photo"), updatePost)
postRouter.delete("/:id", isLogin,deletePost)





module.exports = postRouter;