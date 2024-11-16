const express = require("express")
const route = express.Router();

const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connections")
const User = require("../models/user")

route.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // Only selected statuses allowed
        const ALLOWED_STATUS = ["interested", "ignored"]
        const isAllowedStatus = ALLOWED_STATUS.includes(status)
        if(!isAllowedStatus){
            throw new Error(`${status} is not allowed`)
        }

        // Cannot send request to itself
        if(fromUserId.equals(toUserId)){
            throw new Error("Cannot send connection requests to yourself")
        }

        // Request sent to inValid User
        const toUser = await User.findOne({ "_id": toUserId })
        if(toUser === null){
            throw new Error("Invalid User. Request couldn't be completed")
        }

        // Connection already exists
        const existingConnection = await ConnectionRequest.findOne({$or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
        ]})
        if(existingConnection != null){
            throw new Error("Connection already exists")
        }

        const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status })
        await connectionRequest.save()
        res.send({message: `Request sent. Current status: ${status}`,
            connectionDetails: connectionRequest
        })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = route;