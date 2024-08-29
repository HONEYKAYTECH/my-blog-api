
const Comment = require("../model/comment/comment");
const Post = require("../model/Post/Post");
const User = require("../model/User/User");
const appErr = require("../utils/appErr");


////-----------Comment created---------------------------

const commentCreated = async (req, res, next) => { 
    const {post, description} = req.body
    try {
        //find the post
        const post = await Post.findById(req.params.id)
        // create the comment
        const comment = await Comment.create({post:post._id, description, user: req.userAuth});
        //push the comment to the post
        post.comments.push(comment._id)
        //find the user
        const user = await User.findById(req.userAuth)
        //push to user list
        user.comments.push(comment._id);
        //save
        await post.save();
        await user.save();
        res.json({
            status: "success",
            data: comment,
        })
    } catch (error) {
        next(appErr(error.message));
    }
};

////------------ All comment-------------------////
const allcomment = async (req, res, next) => { 
    const comments = await Comment.find();
    try {
        res.json({
            status: "success",
            data: comments,
        })
    } catch (error) {
        next(appErr(error.message))
    }
};



//.................Single comment...................//
const singleComment = async (req, res, next) => { 
    const comment = await Comment.findById(req.params.id);
    try {
        res.json({
            status: "success",
            data: comment,
        })
    } catch (error) {
        next(appErr(error.message))
    }
};


//....................Update Comment.................................//
const updateComment = async (req, res, next) => { 
    const { post, description } = req.body;
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id,
            { post , description },
            { new: true, runValidators: true }
         );
        res.json({
            status: "success",
            data: comment,
        })
    } catch (error) {
        next(appErr(error.message))
    }
};


//.................Delete Comment...............
const deleteComment = async (req, res, next) => { 
    try {
        //find comment to delete

      const comments =  await Comment.findById(req.params.id);
        
     if(comments.user.toString() !== req.userAuth.toString()){
        return next(appErr("You are not allowed to delete this comment", 403))
     }
     await Comment.findByIdAndDelete(req.params.id)
       
    res.json({
        status: "success",
        message: "Your comment has been deleted successfully",
    })
    } catch (error) {
        next(appErr(error.message))
    }
}





module.exports = {
    commentCreated,
    allcomment,
    singleComment,
    updateComment,
    deleteComment,
}