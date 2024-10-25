const express = require("express")
const { connectDB } = require("./config/database")
const User = require("./models/user")
const { validateUserSignups } = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const { userAuth } = require("./middlewares/auth")

const app = express()

app.use(express.json())
app.use(cookieParser())

const options = {returnDocument: "after", runValidators: true}
const saltValue = 10
const cookieActivityDurationInSeconds = 7*24*60*60 // 7 days in seconds

app.post("/signup", async (req, res) => {
    try{
        validateUserSignups(req)
        const {firstName, lastName, emailId, password, gender, age } = req.body

        const passwordHash = await bcrypt.hash(password, saltValue)
        console.log(passwordHash)
    
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
    try{
        const user = req.user
        res.send(user)
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

app.get("/user/:userId", async (req, res) => {
    const userId = req.params?.userId

    console.log(userId)

    try {
        const user = await User.findOne({ "_id": userId })

        if(user === null) {
            res.status(404).send("No user found")
        }
        else{
            res.send(user)
        }
        
    }
    catch (err) {
        res.status(400).send(err)
    }
})

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId

    try {
        const user = await User.findOne({ emailId: userEmail})
        if(user.length === 0) {
            res.status(404).send("No user found")
        }
        else{
            res.send(user)
        }
        
    }
    catch (err) {
        res.status(400).send("Something went wrong")
    }
})

app.delete("/user", async (req, res) => {
    const userId = req.body.userId
    
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send(user)
    }
    catch (err) {
        res.status(400).send("Something went wrong")
    }

})

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId
    const updatedUserDetails = req.body

    console.log(userId)

    try{
        const ALLOWED_UPDATES = ["age", "photoUrl", "skills", "about", "gender", "password"]

        const isUpdateAllowed = Object.keys(updatedUserDetails).every((val) => {
            return ALLOWED_UPDATES.includes(val)
        })

        if(!isUpdateAllowed){
            throw new Error("Update not Allowed")
        }

        const user = await User.findOneAndUpdate({ "_id": userId }, updatedUserDetails, options);
        if(user === null){
            res.status(404).send("User not found")
        }
        else{
            res.send(user)
        }
    }
    catch (err) {
        res.status(400).send("Something went wrong..."+ err)
    }
})

app.patch("/user", async (req, res) => {
    const userId = req.body.userId
    const updatedUserDetails = {...req.body, "_id": req.body.userId}
    
    try{
        const user = await User.findByIdAndUpdate(userId, updatedUserDetails, options);
        res.send(user)
    }
    catch (err) {
        res.status(400).send("Something went wrong"+ err)
    }
})

connectDB()
    .then(() => {
        console.log("Database Connection established...")
        app.listen(3001, () => {
            console.log("Server is successfully listening on port 3001... ")
        });
    })
    .catch((err) => {
        console.log("Database Connection couldn't be established...")
    })

