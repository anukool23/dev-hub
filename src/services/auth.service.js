const User = require("../models/user.model");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const resetPassword = require("../models/forgotPassword.model");
const { randomNumber } = require("../utils/randomOtp");
const { hashPassword, comparedPassword } = require("../utils/passwordHash");

const signUpService = async (req, res) => {
    try {
        validateSignUpData(req);
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        const savedUser = await user.save();
        const response = savedUser.toObject();
        delete response.password;
        res.status(201).json({
            status: "success",
            message: "User created successfully",
            data: response,
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
};

const loginService = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!validator.isEmail(email)) {
            throw new Error("Invalid email format");
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Invalid email or password");
        }
        // const isPasswordMatch = await bcrypt.compare(password, user.password);
        const isPasswordMatch = await comparedPassword(password, user.password);
        if (!isPasswordMatch) {
            throw new Error("Invalid email or password");
        }
        const token = user.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 1 * 3600000),
        });
        res.status(200).json({
            status: "success",
            message: "Login successful",
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            message: "Login failed",
            error: error.message,
        });
    }
};

const logoutService = (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        });
        res.status(200).json({
            message: "LogOut successful",
        });
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            message: "Login failed",
            error: error.message,
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const email = req.params.email;
        if (!email) {
            throw new Error("Email is required");
        }
        validator.isEmail(email);
        const { _id } = await User.findOne({ email });
        if (!_id) {
            throw new Error("Invalid email, user not found");
        }
        const otp = randomNumber();
        const resetPass = new resetPassword({ userID: _id, otp });
        console.log(otp);
        const savedData = await resetPass.save(resetPass);
        res.status(200).json({
            message: "OTP sent successfully",
            data:{id:savedData._id
            }
        });
    } catch (error) {
        res.status(400).json({
            message: "Error while resetting password",
            error: error.message,
        });
    }
};

const validateOtp = async (req, res) => {
    try {
        const id = req.params.id;
        const { pin, newpassword } = req.body;
        if (!pin || !newpassword) {
            throw new Error("Otp and password are required");
        }
        const otpData = await resetPassword.findById(id);
        if (otpData.used) {
            throw new Error(
                "OTP is used, Please start fresh to reset password"
            );
        }
        if (otpData.otp !== pin) {
            throw new Error("Wrong OTP");
        }
        //Logic to update password
        const hashedPassword =await hashPassword(newpassword);
        await User.findByIdAndUpdate(otpData.userID,{password:hashedPassword});
        await resetPassword.findByIdAndUpdate(id,{ used: true });
        res.status(200).json({
            message: "Password updated successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to reset password",
            error: error.message,
        });
    }
};

module.exports = { signUpService, loginService, logoutService, forgotPassword,validateOtp };
