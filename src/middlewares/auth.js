const jwt = require("jsonwebtoken")
const User = require("../models/user")

const privateKey = "DevTinder@690"

const userAuth = async (req, res, next) => {
    try{
        const { token } = req.cookies

        if (!token) {
            throw new Error("Not logged in")
        }
        const decodedData = await jwt.verify(token, privateKey)

        const { _id } = decodedData

        const user = await User.findOne({ _id })

        if(!user) {
            throw new Error("User not found.")
        }
        req.user = user
        next();
    }
    catch (err) {
        res.status(400).send("Error: " + err.message)
    }
}

module.exports = {
    userAuth
}