const mongoose = require('mongoose');

const forgotPasswordSchema =new  mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    otp:{
        type:Number,
        required:true
    },
    used:{
        type:Boolean,
        required:true,
        default:false
    }
},{
    timestamps:true
})

module.exports = mongoose.model("resetPassword",forgotPasswordSchema);