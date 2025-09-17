const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const userAuth = async (req,res,next)=>{
    try {
        const cookies = req?.cookies;
    if(!cookies || !cookies?.token){
        throw new Error("Authentication required");
    }
    const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
    const {_id} = decoded;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not found");
    }
    req.user = user;
    next();
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            message: "Authentication failed",
            error: error.message,    
        });
    }
}

module.exports = { userAuth };