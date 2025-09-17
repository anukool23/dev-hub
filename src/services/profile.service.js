const user = require("../models/user.model");
const { comparedPassword, hashPassword } = require("../utils/passwordHash");
const { validateUpdateProfile } = require("../utils/validation");

const profile = (req,res) =>{
    try {

    const user = req.user
    return res.status(200).json({
        status:"success",
        message:"User profile fetched successfully",
        data:user
    })
} catch (error) {
    return res.status(400).json({
        status: "failed",
        message: "Fetching profile failed",
        error: error.message,    
    });
}
}

const updateProfile = async (req,res)=>{
    try {
        if(! validateUpdateProfile(req)){
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));
        const savedData = await loggedInUser.save();
        res.status(200).json({
            "message":"Saved successfully",
            data:savedData
        })
        
    } catch (error) {
        return res.status(400).json({
            message:"Invalid request",
            error:error.message
        })
    }
}

const updatePassword = async(req,res)=>{
    try {
        const {password,newpassword} = req.body;
    if(!password || !newpassword){
        throw new Error("Password and New Password are required")
    }
    const isPasswordMatch = await comparedPassword(password, req.user.password);
    console.log("password",isPasswordMatch)
    if(!isPasswordMatch){
        throw new Error("Current password is not correct")
    }
    const newHashedPassword =await hashPassword(newpassword)
    await user.findByIdAndUpdate(req.user._id,{password:newHashedPassword})
    // await user.findByIdAndUpdate(req.user._id)

    res.send("Done")
    } catch (error) {
        return res.status(400).json({
            Message:"Failed to udpate password",
            error:error.message
        })
    }
}


module.exports = {profile,updateProfile,updatePassword}