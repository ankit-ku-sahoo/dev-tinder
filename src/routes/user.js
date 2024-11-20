const express = require("express")
const route = express.Router();

const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connections")
const User = require("../models/user")

const USER_SAFE_DETAILS = ["firstName", "lastName", "age", "gender", "about", "photoUrl", "skills"]

route.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const userId = req.user._id
        const requestsReceived = await ConnectionRequest.find({ 
            toUserId: userId, 
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DETAILS)

        res.send(requestsReceived)
    }
    catch (err) {

    }
})

route.get("/user/requests/connections", userAuth, async (req, res) => {
    const userId = req.user._id
    const connections = await ConnectionRequest.find({
        $or: [
            { toUserId: userId, status: "accepted" },
            { fromUserId: userId, status: "accepted" }
        ]
    }).populate("fromUserId", USER_SAFE_DETAILS)
    .populate("toUserId", USER_SAFE_DETAILS)

    const data = connections.map(connection => {
        if(userId.equals(connection.fromUserId._id)){
            return connection.toUserId
        }
        return connection.fromUserId
    })

    res.send(data)
})

module.exports = route