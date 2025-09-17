const requestModel = require("../models/request.model");
const user = require("../models/user.model");

const getAllPendingRequests = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requests = await requestModel
            .find({ toUserId: loggedInUser._id, status: "interested" })
            .populate("fromUserId", ["firstName", "lastName"]);
        const count = requests.length ?? 0;
        res.status(200).json({
            message: "All requests fetched successfully",
            count,
            data: requests,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Error while fetching data",
            error: error.message,
        });
    }
};

const getAllConnections = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await requestModel
            .find({
                $or: [
                    { fromUserId: loggedInUser._id, status: "accepted" },
                    { toUserId: loggedInUser._id, status: "accepted" },
                ],
            })
            .populate("fromUserId", "firstName lastName")
            .populate("toUserId", "firstName lastName");

        const friends = connections.map((conn) => {
            if (
                conn.fromUserId._id.toString() === loggedInUser._id.toString()
            ) {
                return conn.toUserId;
            } else {
                return conn.fromUserId;
            }
        });

        res.status(200).json({
            message: "Data fetched successfully",
            data: friends,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Error while fetching data",
            error: error.message,
        });
    }
};

const feedService = async (req, res) => {
    try {
        let limit = parseInt(req.query.limit) || 10;
        const pageNumber = parseInt(req.query.page) || 1;
        limit = limit > 50 ? 50 : limit;
        const skip = (pageNumber - 1) * limit;
        const loggedInUser = req.user;
        const connectionList = await requestModel.find({
            $or: [
                { toUserId: loggedInUser._id },
                { fromUserId: loggedInUser._id },
            ],
        });
        const uniqueConnectionList = new Set();
        connectionList.forEach((data) => {
            uniqueConnectionList.add(data.toUserId.toString());
            uniqueConnectionList.add(data.fromUserId.toString());
        });
        const feedUserList = await user
            .find({
                $and: [
                    { _id: { $nin: Array.from(uniqueConnectionList) } },
                    { _id: { $ne: req.user._id } },
                ],
            })
            .select(["firstName", "lastName", "skills", "photoUrl"])
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            message: "Data fetched successfully",
            data: feedUserList,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Error while fetching data",
            error: error.message,
        });
    }
};

module.exports = { getAllPendingRequests, getAllConnections, feedService };
