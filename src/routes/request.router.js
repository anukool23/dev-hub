const express = require('express');
const { requestService, reviewService } = require('../services/request.service');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();

requestRouter.post('/request/:status/:toUserId',userAuth,requestService)
requestRouter.post('/review/:status/:requestId',userAuth,reviewService)

module.exports = {requestRouter}