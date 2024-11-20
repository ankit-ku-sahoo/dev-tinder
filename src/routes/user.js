const express = require("express")
const route = express.Router();

const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connections")
const User = require("../models/user")

const USER_SAFE_DETAILS = ["firstName", "lastName", "age", "gender", "about", "photoUrl", "skills"]

route.get("/feed", userAuth, async (req, res) => {
    try {
        const user = req.user
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 100 ? 100 : limit

        const skip = (page - 1) * limit
        
        const requests = await ConnectionRequest.find({
            $or: [
                { fromUserId: user._id },
                { toUserId: user._id }
            ]
        }).select(["fromUserId", "toUserId"])

        const excludedUserIds = new Set([])
        requests.forEach(request => {
            excludedUserIds.add(request.fromUserId.toString())
            excludedUserIds.add(request.toUserId.toString())
        })

        const feedUsers = await User.find({
            $and: [
                { _id: { $nin: Array.from(excludedUserIds) } },
                { _id: { $ne: user._id } }
            ]
           
        })
        .select(USER_SAFE_DETAILS)
        .skip(skip)
        .limit(limit)

        res.send(feedUsers)
    }
    catch(err) {
        res.status(400).json({message: err.message})
    }
})

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