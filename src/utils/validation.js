const validator = require("validator");

const validateSignUpData = (req) => {
    if(!req.body.email){
        throw new Error("Email is required");
    }
    else if(!validator.isEmail(req.body.email)){
        throw new Error("Invalid email format");
    }
    else if(!req.body.password){
        throw new Error("Password is required");
    }
    else if(validator.isStrongPassword(req.body.password,)){
        throw new Error("Please enter a strong password");
    }
    else if(req.body.firstName && (req.body.firstName.length < 4 || req.body.firstName.length > 50)){
        throw new Error("First name must be between 4 and 50 characters");
    }
}

const validateUpdateProfile = (req) =>{
    const allowedEditFields = ["firstName","lastName","skills","about","age","linkedin","facebook","instagram"];
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditAllowed
}
module.exports = {validateSignUpData,validateUpdateProfile};