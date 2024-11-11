const express = require("express")
const bcrypt = require("bcrypt")
const { userAuth } = require("../middlewares/auth")
const { validatePassword } = require("../utils/validation")
const route = express.Router()

const saltValue = 10

route.get("/view", userAuth, async (req, res) => {
    try{
        const user = req.user
        res.send(user)
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

route.patch("/edit", userAuth, async (req, res) => {
    try{
        const newDetails = req.body

        const ALLOWED_UPDATES = ["age", "photoUrl", "skills", "about", "gender", "password"]

        const isUpdateAllowed = Object.keys(newDetails).every((val) => {
            return ALLOWED_UPDATES.includes(val)
        })

        if(!isUpdateAllowed){
            throw new Error("Update not Allowed")
        }
        
        const loggedInUser = req.user
        Object.keys(newDetails).every((key) => loggedInUser[key] = newDetails[key])

        await loggedInUser.save()
        res.json({message: `Hey ${loggedInUser.firstName}, details have been successfully updated`, data: loggedInUser})
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

route.patch("/password/reset", userAuth, async (req, res) => {
    try{
        const newPassword = req.body.password
        validatePassword(newPassword)

        const passwordHash = await bcrypt.hash(newPassword, saltValue)

        const user = req.user
        user["password"] = passwordHash
        await user.save()
        res.send("Password updated successfully")
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

module.exports = route