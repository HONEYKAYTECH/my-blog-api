const express = require("express");
const { commentCreated, allcomment, singleComment, updateComment, deleteUpdate, deleteComment } = require("../controller/commentCtrl");
const isLogin = require("../middlewares/isLogin");
const commentRouter = express.Router();


commentRouter.post("/:id",isLogin,commentCreated)
commentRouter.get("/",allcomment)
commentRouter.get("/:id",singleComment)
commentRouter.put("/:id",isLogin,updateComment)
commentRouter.delete("/:id",isLogin,deleteComment)




module.exports = commentRouter;