const express = require("express");
const { authAdmin } = require("./middlewares/auth");
const { errorHandler } = require("./middlewares/error");
const { connectDB } = require("./config/db");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json()); 

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

app.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const {firstName,lastName,email,password,} = req.body
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        const savedUser = await user.save()
        const response = savedUser.toObject();
        delete response.password;
        res.status(201).json({
            status: "success",
            message: "User created successfully",
            data: response ,
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                status: "failed",
                message:
                    "Email is already registered with us, try with another email or proceed to login",
            });
        } else {
            console.log(error.stack);
            res.status(400).json({
                status: "failed",
                message: "User creation failed",
                error: error.message,
            });
        }
    }
});

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

app.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!validator.isEmail(email) ){
            throw new Error("Invalid email format");
        }
        const user = await User.findOne({email});
        if(!user){
            throw new Error("Invalid email or password");
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            throw new Error("Invalid email or password");
        }
        res.status(200).json({
            status:"success",
            message:"Login successful, le le le maza le",
            data:{
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email,
            }
        })
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            message: "Login failed",
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
