const User = require("../model/User/User")
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const appErr = require("../utils/appErr");

const Category = require("../model/category/category");
const Post = require("../model/Post/Post");
const Comment = require("../model/comment/comment");

//Register
const register = async (req, res, next) => {
    const {firstName, lastName, profilePhoto, password,email} = req.body;
    try {
        //check if email is exist
        const userFound = await User.findOne({email});
        if(userFound) {
            return next(appErr("User already exists"));
            // return res.json({
            //     msg: "User already exist",
            // });
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        //create the user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        
        });
        res.json({
            status: "success",
            // data: "User Register Successfully"
            data: user,
        })
    } catch (error) {
        // res.json(error.message)
        next(appErr(error.message));
    }
};

//Login
const login = async (req, res, next) => { 
    const {email, password} = req.body;

    try {
        //check if email exists
        const userFound = await User.findOne({email});
        if (!userFound) {
            return next(appErr("Invalid credentials", 400));
            // return res.json({
            //     msg: "Invalid credentials",
            // });
        }
        //verify password
        // const isPasswordMatched = await bcrypt.compare(
        //     password,
        //     userFound.password
        // );

        // if (!isPasswordMatched) {
        //     return next(appErr("Invalid credentials", 400));
        //     // return res.json({
        //     //     msg: "Invalid credentials",
        //     // });
        // }
        res.json({
            status: "success",
            data: {
                id: userFound._id,
                firstName: userFound.firstName,
                email: userFound.email,
                // isAdmin: userFound.isAdmin,
                token: generateToken(userFound._id)
            }
        })
    } catch (error) {
        next(appErr(error.message));
        // res.json(error.message)
    }
};
//All Users
const allUsers = async (req, res, next) => { 
    try {
        const users = await User.find();
        res.json({
            status: "success",
            data: users,
        })
    } catch (error) {
        next(appErr(error.message));
        // res.json(error.message)
    }
}
//Following
const FollowingCtrl = async (req, res, next) => { 
    try {
        // 1. find the user to follow
       const userToFollow = await User.findById(req.params.id);
       //2. find the user who is following
       const userWhoFollowed = await User.findById(req.userAuth);

       // 3.check if user and userWhoFollowed are found
       if(userToFollow && userWhoFollowed) {
        //4. check if userWhoFollowed is already in the user's followers array
        const isUserAlreadyfollowed = userToFollow.followers.find(
            (follower) => follower.toString() === userWhoFollowed._id.toString()
        );
        if(isUserAlreadyfollowed) {
            return next(appErr("You already followed the user"));
        }else{
            //5. push userWhoFollowed in to the user's followers array
            userToFollow.followers.push(userWhoFollowed._id);
            //6. push userToFollow to the userWhoFollowed following array
            userWhoFollowed.following.push(userToFollow._id);
            //save
            await userWhoFollowed.save();
            await userToFollow.save();
        }
       }
        res.json({
            status: "success",
            message: "Youhave successfully followed this user",
            followers: userToFollow.followers,
            following: userWhoFollowed.following,
        });
    } catch (error) {
        next(appErr(error.message));
        // res.json(error.message)
    }
}
//Block User
const blockedUserCtrl = async (req, res, next) => { 
    try {
        // 1. find the user to Block
       const userToBlocked = await User.findById(req.params.id);
       //2. find the user who is Blocked User
       const userWhoBlocked = await User.findById(req.userAuth);

       // 3.check if user and userWhoBlocked are found
       if(userToBlocked && userWhoBlocked) {
        //4. check if userWhoBlocked is already in the user's blocked array
        const isUserAlreadyBlocked = userWhoBlocked.blocked.find(
            (blocked) => blocked.toString() === userToBlocked._id.toString()
        );
        if(isUserAlreadyBlocked) {
            return next(appErr("You already blocked the user"));
        }else{
            //5. push userToBlocked in to the userWhoBlocked's blocked array
            userWhoBlocked.blocked.push(userToBlocked._id);
            // //6. push userToFollow to the userWhoFollowed following array
            // userWhoFollowed.following.push(userToFollow._id);
            // 7. save
            await userWhoBlocked.save();
            // await userToFollow.save();
        }
       }
        res.json({
            status: "success",
            message: "Youhave successfully blocked this user",
            blocked: userWhoBlocked.blocked,
        
        });
    } catch (error) {
        next(appErr(error.message));
    }
}

//Unfollow
const UnFollowCtrl = async (req, res, next) => {
    try {
        //1. find the user to follow
        const userToBeUnfollowed = await User.findById(req.params.id);
        //2. find the user who is following
        const userWhoUnfollowed = await User.findById(req.userAuth);
        //3.  check if user and userWhoUnfollowed are found
        if(userToBeUnfollowed && userWhoUnfollowed) {
            //4. check if userWhoUnfollowed is already in the user's  followers array 
            const isUserAlreadyfollowed = userToBeUnfollowed.followers.find(
                (follower) => follower.toString() === userWhoUnfollowed._id.toString()
            );
            if(!isUserAlreadyfollowed) {
                return next(appErr("You have not followed this user"));
            }else{
                //5. Remove userWhoUnfollowed from the user's followers array
                userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(
                    (follower) => follower.toString() !== userWhoUnfollowed._id.toString()
                );
                //6. Save the user 
                await userToBeUnfollowed.save();
                //7. Remove userToBeUnfollowed from the userWhoUnfollowed's following array
                userWhoUnfollowed.following = userToBeUnfollowed.following.filter(
                    (follower) => follower.toString() !== userWhoUnfollowed._id
                );
                //8. Save the user
                await userWhoUnfollowed.save();
                res.json({
                    status: "success",
                    msg: "You have successfully unfollowed the user",
                    usertobeunfollow: userWhoUnfollowed.followers,
                    userwhounfollowed: userWhoUnfollowed.following,
                });
            }
        }
        
    } catch (error) {
        next(appErr(error.message));
    };
}
//UnBlocked User
const UnBlockedCtrl = async (req, res, next) => {
    try {
        //1. find the user to unblocked
        const userToBeUnBlocked = await User.findById(req.params.id);
        //2. find the user who is blocked
        const userWhoUnBlocked = await User.findById(req.userAuth);
        //3.  check if user and userWhoUnblocked are found
        if(userToBeUnBlocked && userWhoUnBlocked) {
            //4. check if user is already in the userWhoUnblocked's  blocked array 
            const isUserAlreadyblocked = userWhoUnBlocked.blocked.find(
                (blocked) => blocked.toString() === userToBeUnBlocked._id.toString()
            );
            if(!isUserAlreadyblocked) {
                return next(appErr("You have not blocked this user"));
            }else{
                //5. Remove userWhoUnblocked from the user's blocked array
                userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(
                    (blocked) => blocked.toString() !== userToBeUnBlocked._id.toString()
                );
                //6. Save the user 
                await userWhoUnBlocked.save();
                
                res.json({
                    status: "success",
                    msg: "You have successfully unblocked the user",
                    userwhounblocked: userWhoUnBlocked.blocked,
                });
            }
        }
        
    } catch (error) {
        next(appErr(error.message));
    };
}

//Admin blocked
const adminBlockUserCtrl = async (req, res, next) => {
    try {
        // find the user to be blocked
        const userToBeBlocked = await User.findById(req.params.id);
        if (!userToBeBlocked) {
            return next(appErr("User not found", 400));
        }
        //Change the isBlocked to true
        userToBeBlocked.isBlocked = true;
        await userToBeBlocked.save();
        res.json({
            status: "success",
            data: "You have successfully blocked this user",
        })
    } catch (error) {
      next(appErr(error.message)) ; 
    }
};
const adminUnBlockUserCtrl = async (req, res, next) => {
    try {
        // find the user to be Unblocked
        const userToBeUnBlocked = await User.findById(req.params.id);
        if (!userToBeUnBlocked) {
            return next(appErr("User not found", 400));
        }
        //Change the isBlocked to false
        userToBeUnBlocked.isBlocked = false;
        await userToBeUnBlocked.save();
        res.json({
            status: "success",
            data: "You have successfully Unblocked this user",
        })
    } catch (error) {
      next(appErr(error.message)) ; 
    }
};

//Single User
const singleUser = async (req, res) => { 
    
    const user = await User.findById(req.userAuth);
    try {
        res.json({
            status: "success",
            data: user
        })
    } catch (error) {
        next(appErr(error.message));
        // res.json(error.message)
    }
}
//Update User
const updateUser = async (req, res) => { 
    try {
        res.json({
            status: "success",
            data: "Update Users"
        })
    } catch (error) {
        res.json(error.message)
    }
}

// UPDATE USER
const updateUserCtrl = async (req, res, next) => { 
    const { email, firstName, lastName } = req.body;
    try {
        //check if email
        if (email) {
            const emailFound = await User.findOne({ email: email});
            if(emailFound) {
                return next (app("Email is taken", 400));
            }
        }
        //update the user
        const user = await User.findByIdAndUpdate(
            req.userAuth,
            { lastName, firstName, email},
            { new: true, runValidators: true }
        );
        res.json({
            status: "success",
            data: user,
        })
    } catch (error) {
        res.json(error.message)
    }
};
// UPDATE PASSWORD
const updatePasswordCtrl = async (req, res, next) => { 
    const { password } = req.body;
    try {
        //check if user is updating password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            //update user
            await User.findByIdAndUpdate(
                req.userAuth,
                {
                    password: hashedPassword,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.json({
                status: "success",
                data: "Password updated successfully",
            });
        }else{
            return next(appErr("Please provide password field"));
        }   
    } catch (error) {
        res.json(error.message)
    }
};

//Delete User
const deleteUserCtrl = async (req, res) => { 
    try {
        //1. find the user to be deleted
        await User.findByIdAndDelete(req.userAuth);
        //2. find all posts by the user to be deleted
        await Post.deleteMany({ user:req.userAuth});
        //3. Delete all comments of the user
        await Comment.deleteMany({user:req.userAuth});
        //4. Delete all categories of the user
        await Category.deleteMany({ user:req.userAuth});
        //5. Delete user
        // await userTodelete.delete();

        res.json({
            status: "success",
            data: "Your account has been deleted successfully"
        })
    } catch (error) {
        res.json(error.message)
    }
}
// who view user profile
const whoViewedMyProfileCtrl = async (req, res, next) => {
    try {
        // 1. find the original user
        const user = await User.findById(req.params.id);

        // 2. find the user who viewed the profile
        const userWhoViewed = await User.findById(req.userAuth);

        // 3. check if original and who viewed are found 
        if(user && userWhoViewed){

            // 4. check if userWhoViewed is already in the user viewers array
            const isUserAlreadyViewed = user.viewers.find(
                (viewers) => viewers.toString() === userWhoViewed._id.toJSON()
            );
            if(isUserAlreadyViewed) {
                return next(appErr("You already viewed this profile"));
            }else{
                // 5. push the userWhoViewed into the user's viewers array
                user.viewers.push(userWhoViewed._id);
                // 6. save the user
                await user.save();
                res.json({
                    status: "success",
                    msg: "You have successfully viewed this profile",
                    data: user.viewers,
                });
            }
        }  
    } catch (error) {
        next(error.message, 500);
    }
}
const profilePhotoUploadCtrl = async (req, res, next) => {
    try {
        //1. find the user to be update
        const userToUpdate = await User.findById(req.userAuth);
        //2 check if userfound
        if(!userToUpdate){
            return next (appErr("User not found", 403));
        }
        //3 check if user is blocked
        if(userToUpdate.isBlocked) {
            return next(appErr("Action not allowed, your account is blocked", 403));
        }
        //4 check if a user is updating their photo 
        if(req.file) {
            await User.findByIdAndUpdate(
                req.userAuth,
                {
                    $set: {
                        profilePhoto : req.file.path
                    },
                },
                {
                    new: true,
                }
            ),
            res.json({
                status: "success",
                data: "You have successfully updated your profile",
            });
        }
    } catch (error) {
        next(appErr(error.mess, 500));
    }
};

module.exports = {
    register,
    login,
    allUsers,
    singleUser,
    updateUser,
    deleteUserCtrl,
    profilePhotoUploadCtrl,
    whoViewedMyProfileCtrl,
    FollowingCtrl,
    UnFollowCtrl,
    blockedUserCtrl,
    UnBlockedCtrl,
    adminBlockUserCtrl,
    adminUnBlockUserCtrl,
    updateUserCtrl,
    updatePasswordCtrl,
}