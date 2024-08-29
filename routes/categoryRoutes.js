const express = require("express");
const { categoryCreated, allCategory, singleCategory, updateCategory, deleteCategory, categoryCreatedCtrl, fetchCategoryCtrl, singleCategoryCtrl } = require("../controller/categoryCtrl");
const isLogin = require("../middlewares/isLogin");
const categoryRouter = express.Router();


categoryRouter.post("/" ,isLogin,categoryCreatedCtrl)
categoryRouter.get("/",fetchCategoryCtrl)
categoryRouter.get("/:id",singleCategoryCtrl)
categoryRouter.put("/:id", isLogin,updateCategory)
categoryRouter.delete("/:id",isLogin,deleteCategory)





module.exports = categoryRouter;