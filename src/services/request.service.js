const express = require("express");
const user = require("../models/user.model");
const connectionRequest = require("../models/request.model");
const { mongoose, Mongoose } = require("mongoose");

const requestService = async (req, res) => {
    try {
        const { status, toUserId } = req.params;
        const fromUserId = req.user._id;
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "The status is not allowed",
            });
        }
        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res
                .status(400)
                .json({ error: "Invalid ObjectId for sending request" });
        }
        if (fromUserId.equals(toUserId)) {
            return res.status(400).json({
                message: "You cannot send request to yourself",
            });
        }
        const fromUser = await user.findById(toUserId);
        if (!fromUser) {
            return res.status(400).json({
                message: "You are sending request to non existing user",
            });
        }
        const existingRequest = await connectionRequest.findOne({
            $or: [
                { toUserId, fromUserId },
                { toUserId: fromUserId, fromUserId, toUserId },
            ],
        });
        if (existingRequest) {
            return res.status(400).json({
                message: "connection request already exists",
            });
        }
        const data = new connectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const savedRequest = await data.save();
        const responseMessage =
            status === "ignored"
                ? "Request ignored successfully"
                : "Request sent successfully";
        res.status(201).json({
            message: responseMessage,
            data: savedRequest,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Error while saving request",
            error: error.message,
        });
    }
};

const reviewService = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                message: "Invalid request ID",
            });
        }
        const allowed_status = ["accepted", "rejected"];
        if (!allowed_status.includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
            });
        }
        const isvalidData = await connectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });
        if (!isvalidData) {
            return res.status(404).json({
                message: "No request exist fot this combination",
            });
        }
        isvalidData.status = status;
        await isvalidData.save();
        return res.status(200).json({
            message: "Connection request " + status,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Error while saving request",
            error: error.message,
        });
    }
};

module.exports = { requestService, reviewService };
