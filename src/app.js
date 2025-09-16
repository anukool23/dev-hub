const express = require("express");
const { authAdmin } = require("./middlewares/auth");
const { errorHandler } = require("./middlewares/error");
const { connectDB } = require("./config/db");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const authRouter = require("./routes/auth.router");
const profileRouter = require("./routes/profile.router");
const { requestRouter } = require("./routes/request.router");
// const cors = require('cors');

const app = express();
require("dotenv").config();


const PORT = process.env.PORT || 3000; 
const JWT_SECRET = process.env.JWT_SECRET

// Middleware to parse JSON bodies
app.use(express.json()); 
app.use(cookieParser())
// app.use(cors())


app.use('/auth',authRouter)
app.use('/profile',profileRouter);
app.use('/connection',requestRouter)

app.get("/user", async (req, res) => {
    try {
        if (!req.body.email) {
            res.status(400).json({
                status: "failed",
                message: "Email is required",
            });
        }
        const user = await User.findOne({ email: req.body.email }).select("-password");
        if (!user) {
            res.status(404).json({
                status: "failed",
                message: "User not found",
            });
        }
        res.status(200).json({
            status: "success",
            message: "User fetched successfully",
            data: user,
        });
    } catch (error) {
        console.log(error.stack);
        res.status(500).json({
            status: "failed",
            message: "Internal server error",
            error: error.message,
        });
    }
});

app.get('/users',async(req,res)=>{
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json({
            status:"success",
            message:"Users fetched successfully",
            data:users
        })
    } catch (error) {
        console.log(error.stack);
        res.status(500).json({
            status: "failed",
            message: "Internal server error",
            error: error.message,
        });
    }
})



app.delete("/user/:id",async(req,res)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status:"success",
            message:"User deleted successfully",
            data:user
        })
    } catch (error) {
        console.log(error.stack);
        res.status(500).json({
            status: "failed",
            message: "Internal server error",
            error: error.message,
        });
    }
})

// app.put("/user/:id",async(req,res)=>{
//     try {
//         const user = await User.findByIdAndUpdate(req.params.id,req.body,{runValidators:true});
//         res.status(200).json({
//             status:"success",
//             message:"User updated successfully",
//             data:user
//         })
//     } catch (error) {
//         console.log(error.stack);
//         res.status(500).json({
//             status: "failed",
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// })

app.patch("/user/:id",async (req,res)=>{
    try { 
        const id = req.params?.id;
        const data = req.body;
        const ALLOWED_UPDATES = ["firstName","lastName","password","gender"];
        if(!id || !data){
            return res.status(400).json({
                status:"failed",
                message:"Id and data are required"
            })
        }
        const isValidOperations = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if(!isValidOperations){
            throw new Error("Invalid updates! You can only update "+ALLOWED_UPDATES.join(", "));
        }
        const user = await User.findByIdAndUpdate(id,{...data,$inc: { __v: 1 }},{runValidators:true,returnDocument:"after"}).select("-password");
        res.status(200).json({
            status:"success",
            message:"User updated successfully",
            data:user
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: "Update failed",
            error: error.message,
        });
    }

})



app.use("/", errorHandler);

const startServer = async () => {
    try {
        await connectDB();
        console.log("✅ Database connected");

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    }
};

startServer();
