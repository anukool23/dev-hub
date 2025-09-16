const express = require('express');
const { profile, updateProfile, updatePassword } = require('../services/profile.service');
const { userAuth } = require('../middlewares/auth');
const profileRouter = express.Router();

profileRouter.get('/view',userAuth,profile);
profileRouter.patch('/edit',userAuth,updateProfile);
profileRouter.post('/updatepassword',userAuth,updatePassword)

module.exports = profileRouter