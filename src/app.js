const express = require("express")
const { connectDB } = require("./config/database")
const User = require("./models/user")

const app = express()

app.use(express.json())

app.post("/signup", async (req, res) => {
    const userObj = req.body

    const user = new User(userObj)

    try{
        await user.save()
        res.send("User added successfully...")
    }
    catch (err) {
        res.status(400).send("Error saving the user...")
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

app.patch("/user", async (req, res) => {
    const userId = req.body.userId
    const updatedUserDetails = {...req.body, "_id": req.body.userId}
    
    try{
        const user = await User.findByIdAndUpdate(userId, updatedUserDetails, {returnDocument: "after"});
        res.send(user)
    }
    catch (err) {
        res.status(400).send("Something went wrong")
    }
})

app.patch("/user/:emailId", async (req, res) => {
    const emailId = req.params.emailId
    const updatedUserDetails = req.body

    console.log(emailId)


    try{
        const user = await User.findOneAndUpdate({ emailId: emailId }, updatedUserDetails, {returnDocument: "after"});
        if(user.length === 0){
            res.status(404).send("User not found")
        }
        else{
            res.send(user)
        }
    }
    catch (err) {
        res.status(400).send("Something went wrong")
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

