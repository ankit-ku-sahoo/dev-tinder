const express = require("express")
const { connectDB } = require("./config/database")
const User = require("./models/user")

const app = express()

app.post("/signup", async (req, res) => {
    const userObj = {
        firstName: "Ankit Kumar",
        lastName: "Sahoo",
        emailId: "10ankitkusahoo10@gmail.com",
        password: "abcd1234"
    }

    const user = new User(userObj)

    try{
        await user.save()
        res.send("User added successfully...")
    }
    catch (err) {
        res.status(400).send("Error saving the user...")
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

