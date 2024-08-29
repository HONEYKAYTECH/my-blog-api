const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Post title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Post description is required"],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Post category is required"],
        },
        numViews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        likes: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User", 
            },
        ],
        dislikes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please Author is required"],
        },
        photo: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: {virtuals: true}
    }
);


postSchema.pre(/^find/, function(next) {
    //find viewsCount as virtual field
    postSchema.virtual("viewsCount").get(function(){
        const post = this;
     return post.numViews.length;
});
    
postSchema.virtual("likesCount").get(function(){
    const post = this;
    return post.likes.length; 
 });

 postSchema.virtual("dislikesCount").get(function(){
    const post = this;
    return post.dislikes.length
 });
//check the most likes post in percentage
 postSchema.virtual("likesPercentage").get(function(){
    const post = this;
    const total = post.likes.length + +post.dislikes.length
    const percentage = Math.floor((post.dislikes.length / total ) * 100);
    return `${percentage}%`;
 });
//check the most dislikes post in percentage
 postSchema.virtual("dislikesPercentage").get(function(){
    const post = this;
    const total = post.likes.length + +post.dislikes.length
    const percentage = Math.floor((post.dislikes.length / total ) * 100);
    return `${percentage}%`;
 });
 //if day is less than 0 return Today, if day is 1 return Yesterday else return number of days ago
 postSchema.virtual("daysAgo").get(function(){
    const post = this;
    const date = new Date(post.createdAt)
    const daysAgo = Math.floor((Date.now() - date) / 86400000);
    return daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;
    


 });



    next();
});

//find likesCount as virtual field

    

//.............. Get ViewsCount...........//
// postSchema.virtual("viewsCount").get(function(){
//     return this.views.length
// }
// );
// //.............Get LikesCount...............
// postSchema.virtual("likesCount").get(function(){
//     return this.likes.length
// }
// );
// //.............Get DislikesCounts............//
// postSchema.virtual("dislikesCount").get(function(){
//     return this.dislikes.length
// }
// );



 const Post = mongoose.model("Post", postSchema);

 module.exports = Post;