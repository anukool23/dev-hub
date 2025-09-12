const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        maxLength: 50,
        minLength: 2
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
    }
},{
    timestamps: true,
    optimisticConcurrency: true
}
);

module.exports = mongoose.model("User", userSchema);
