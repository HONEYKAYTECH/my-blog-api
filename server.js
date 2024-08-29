const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const globalErrHandler = require("./middlewares/globalErrHandler");
dotenv.config();
require("./config/dbConnect");
const app = express();

//middleware
app.use(express.json());
const userAuth = {
    isLogin: true,
    isAdmin: false,
};
// app.use((req, res, next) => {
//     if (userAuth.isLogin){
//         next();
//     }else{
//         return res.json({
//             msg: "Invalid login credentials",
//         });
//     }
// }

// )
//routes

//----User---
app.use("/api/v1/user",userRouter);
app.use("/api/v1/post",postRouter);
app.use("/api/v1/comment",commentRouter)
app.use("/api/v1/category",categoryRouter)


//Error handler middleware
app.use(globalErrHandler);

//404 error
app.use("*", (req ,res) => {
    res.status(404).json({
        message: `${req.originalUrl} - Route not found`,
    });
});
//Listen to server



const PORT = process.env.PORT || 9000;
app.listen(PORT , console.log(`server running on port ${PORT}`))
