const express = require("express");
const { signUpService, loginService, logoutService, forgotPassword, validateOtp } = require("../services/auth.service");
const { updatePassword } = require("../services/profile.service");
const authRouter = express.Router();

authRouter.post('/signup',signUpService);
authRouter.post('/login',loginService);
authRouter.post('/logout',logoutService);
authRouter.get('/forgotpassword/:email',forgotPassword);
authRouter.post('/validateotp/:id',validateOtp);

module.exports = authRouter;