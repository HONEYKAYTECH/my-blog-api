
const Post = require("../model/Post/Post");
const User = require("../model/User/User");
const appErr = require("../utils/appErr");

//Post created

const createPostCtrl = async (req, res, next) => {
const { title, description, category} = req.body;
try {
    //Find the user
    const author = await User.findById(req.userAuth);
    // check if the user is blocked
    if( author.isBlocked){
        return next(appErr("Access denied, account blocked", 400))
    }
    //check if title is already taken
    const postTitle = await Post.findOne({title})
    if(postTitle){
        return next(appErr(`${title} already exist`, 403));
    }
    //Create the post 
    const postCreated = await Post.create({
        title,
        description,
        category,
        user: author._id,
    });
    // All c

    // Associate user to a post -Push the post in to post
    author.posts.push(postCreated);
    await author.save();
    res.json({
        status: "Success",
        data: postCreated
    })
} catch (error) {
  res.json(error.message);  
}
};

// All post
const fetchPostCtrl = async (req, res) => { 
    try {
        const posts = await Post.find({}).populate("category", "title").populate("user");

        // check if the user is blocked by the post owner 
        const filterPosts = posts.filter((post) => {
            //get all blocked user
            const blockedUsers = post.user.blocked;
            const isBlocked = blockedUsers.includes(req.userAuth);

            return !isBlocked;
        })
        res.json({
            status: "success",
            data: filterPosts, 
        })
    } catch (error) {
        res.json(error.message)
    }
};

//ToggleLikes
const toggleLikesPostCtrl = async (req,res,next) => {
    try {
        // Get the post
    const post = await Post.findById(req.params.id);
    //check if the user has already Disliked the post
    const isDisLiked = post.dislikes.includes(req.userAuth );
        //if the user has already liked the post
        const isLiked = post.likes.includes(req.userAuth);
        
        if(isDisLiked) {
           return next(
            appErr("You have already dislikes this post, Unlike to like the post", 400)
           );
        }else{
            //if the user has already liked the post ,unlike the post
            if(isLiked) {
                post.likes = post.likes.filter(
                    (likes) => likes.toString() !== req.userAuth.toString()
                );
                await post.save();
            }else{
                //if the user has not liked the post, like the post
                post.likes.push(req.userAuth);
                await post.save();
            }
            res.json({
                status: "success",
                data: post,
            })
        }
   
    } catch (error) {
       next(error.message) 
    }
}

//ToggleDisLikes
const toggleDisLikesPostCtrl = async (req,res,next) => {
    try {
        // Get the post
    const post = await Post.findById(req.params.id);
    //check if the user has already Disliked the post
    const isDisLiked = post.dislikes.includes(req.userAuth );
        //if the user has already liked the post
        const isLiked = post.likes.includes(req.userAuth);
        
        if(isLiked) {
           return next(
            appErr("You have already likes this post, Unlike to like the post", 403)
           );
        }else{
            //if the user has already liked the post ,unlike the post
            if(isDisLiked) {
                post.dislikes = post.dislikes.filter(
                    (dislikes) => dislikes.toString() !== req.userAuth.toString()
                );
                await post.save();
            }else{
                //if the user has not liked the post, like the post
                post.dislikes.push(req.userAuth);
                await post.save();
            }
            res.json({
                status: "success",
                data: post,
            })
        }
   
    } catch (error) {
       next(appErr(error.message)) 
    }
}


// post Details 
const postDetailsCtrl = async (req, res, next) => {
    try {
        // find the post
        const post = await Post.findById(req.params.id);
        //Number of view
        //check if the user viewed this post
        const isViewed = await post.numViews.includes(req.userAuth)
        if(isViewed) {
         res.json({
            status: "success",
            data: post,
         })
        } else{
            //push into numViews
            post.numViews.push(req.userAuth);
            await post.save();
            res.json({
                data: "success",
                data: post,
            });
        }

         
    } catch (error) {
        next(appErr(error.message));
    }
    
};



//Single post
const singlePost = async (req, res) => { 
    try {
        const singlePost = await Post.findById(req.params.id)
        res.json({
            status: "success",
            data: singlePost
        })
    } catch (error) {
        res.json(error.message)
    }
}
//Update post
const updatePost = async (req, res, next) => { 
    const { title, description , category} = req.body;
    try {
        //find the post
        const post = await Post.findById(req.params.id);
        if(post.user.toString() !== req.userAuth.toString()){
           return next(appErr("You are not allowed to update this post", 403))
        }
        await Post.findByIdAndUpdate(req.params.id,
            { title, description, category,photo: req?.file?.path},
            {new: true}
        );
        res.json({
            status: "success",
            data: post,
        })
    } catch (error) {
       next(appErr(error.message))
    }
}
//Delete post
const deletePost = async (req, res, next) => { 
    try {
        //find post to delete
        
     const post = await Post.findById(req.params.id);
     if(post.user.toString() !== req.userAuth.toString()){
        return next(appErr("You are not allowed to delete this post", 403))
     }
       await Post.findByIdAndDelete(req.params.id)
       
        res.json({
            status: "success",
            message: "Your post has been deleted successfully"
        })
    } catch (error) {
        next(appErr(error.message))
    }
}















module.exports = {
    createPostCtrl,
    fetchPostCtrl,
    toggleLikesPostCtrl,
    toggleDisLikesPostCtrl,
    postDetailsCtrl,
    singlePost,
    updatePost,
    deletePost,
   
    
    
}