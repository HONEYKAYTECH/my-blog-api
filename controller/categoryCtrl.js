const Category = require("../model/category/category");
const appErr = require("../utils/appErr");

///...........Category created...................///
const categoryCreatedCtrl = async (req, res, next) => { 
    const { title} = req.body;
    try {
        const category = await Category.create({ title, user: req.userAuth});
        res.json({
            status: "success",
            data: category,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}
//............All category...........................//
const fetchCategoryCtrl = async (req, res, next) => { 
    try {
        const categories = await Category.find();
        res.json({
            status: "success",
            data: categories,
        })
    } catch (error) {
        next(appErr(error.message));
    }
};
//...............Single category................//
const singleCategoryCtrl = async (req, res,next) => { 
    try {
        const category = await Category.findById(req.params.id);
        res.json({
            status: "success",
            data: category,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}
//..............Update..................................//
const updateCategory = async (req, res,next) => { 
    const { title } = req.body;
    try {
       const category = await Category.findByIdAndUpdate(req.params.id,
       { title },
       { new: true, runValidators: true }
    );
        res.json({
            status: "success",
            data: category,
        })
    } catch (error) {
        next(appErr(error.message))
    }
};
//Delete
const deleteCategory = async (req, res, next) => { 
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({
            status: "success",
            message: "Category has been deleted successfully",
        })
    } catch (error) {
        next(appErr(error.message));
    }
}




module.exports = {
    categoryCreatedCtrl,
    fetchCategoryCtrl,
    singleCategoryCtrl,
    updateCategory,
    deleteCategory,
}