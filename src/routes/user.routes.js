const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { getAllPendingRequests,getAllConnections,feedService } = require("../services/user.service");
const userRouter = express.Router();

userRouter.get('/requests',userAuth,getAllPendingRequests)
userRouter.get('/connections',userAuth,getAllConnections);
userRouter.get('/feed',userAuth,feedService);


module.exports = {userRouter}