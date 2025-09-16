const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        maxLength: 50,
        minLength: 2,
        required:true
    },
    lastName: { 
        type: String 
    },
    email: { 
        type: String, 
        unique: true, 
        required: true ,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email format")
            }
        }
    },
    password: { 
        type: String, 
        required: true 
    },
    gender: { 
        type: String ,
        validate(value){
            if(!["male", "female"].includes(value.toLowerCase()) ){
                throw new Error("Gender must be male or female")
            }
        }
    },
    skills:{
        type:[String],
        default:[],
        validate(arr){
            if(arr.length > 5){
                throw new Error("Skills can't be more than 5")
            }
        }
    },
    about:{
        type:String,
    },
    facebook:{
        type:String
    },
    instagram:{
        type:String
    },
    linkedin:{
        type:String
    },
    photoUrl:{
        type:String
    },
    age:{
        type:String
    }
}
,{
    timestamps: true,
    optimisticConcurrency: true
}
);

userSchema.methods.getJWT = function(){
    const token = jwt.sign({_id:this._id},JWT_SECRET,{expiresIn:"1d"})
    return token;
}


module.exports = mongoose.model("User", userSchema);
