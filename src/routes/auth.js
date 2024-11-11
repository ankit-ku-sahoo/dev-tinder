const express = require("express")
const User = require("../models/user")
const { validateUserSignups } = require("../utils/validation")
const bcrypt = require("bcrypt")
const route = express.Router();

const saltValue = 10
const cookieActivityDurationInSeconds = 7*24*60*60 // 7 days in seconds

route.post("/signup", async (req, res) => {
    try{
        validateUserSignups(req)
        const {firstName, lastName, emailId, password, gender, age } = req.body

        const passwordHash = await bcrypt.hash(password, saltValue)
    
        const user = new User({
            firstName, lastName, emailId, gender, age, password: passwordHash
        })

        await user.save()
        res.send("User added successfully...")
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
    
})

route.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body

        const user = await User.findOne({ emailId })

        if(!user) {
            throw new Error("Email or password is not correct.")
        }

        const isPasswordCorrect = await user.validatePassword(password);
        if(!isPasswordCorrect) {
            throw new Error("Email or password is not correct.")
        }

        const token = await user.getJWT()
        
        const expiryDate = new Date(Date.now()+cookieActivityDurationInSeconds*1000)
        res.cookie("token", token, {"expires": expiryDate})
        res.send("Login successful")

    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

route.post("/logout", async (req, res) => {
    res.clearCookie("token").send("Logout successful!")
})

module.exports = route;