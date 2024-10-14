const express = require("express")
const { adminAuth, userAuth } = require("./middlewares/auth")

const app = express()

app.use(
    "/user/login", 
    (req,res) => {
        res.send("User has been logged in... ")
    }
)

app.use(
    "/user", 
    userAuth,
    (req,res) => {
        console.log("Inside /user")
        res.send("Handling route /user... ")
    }
)

app.use("/admin", adminAuth)

app.use("/admin/getAllUserData", (req,res) => {
    res.send("All user data sent")
})

app.use("/", (err,req,res,next) => {
    res.send(500).send("Something went wrong")
})

app.listen(3001, () => {
    console.log("Server is successfully listening on port 3001... ")
});