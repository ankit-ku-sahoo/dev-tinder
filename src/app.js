const express = require("express")

const app = express()

app.use(
    "/user", 
    (req,res) => {
        console.log("Inside /user")
        res.send("Handling route /user... ")
    }
)

// This will go into an infinite loop & will timeout as there's no response sent
app.use(
    "/test1", 
    (req,res) => {
        console.log("Inside /user")
        // res.send("Handling route /user... ")
    },
    (req,res) => {
        console.log("Inside /user PART 2")
        res.send("Handling route /user... ")
    },
)

// This will send a response as the next handler was called
app.all(
    "/test2", 
    (req,res,next) => {
        console.log("Inside /user")
        next()
        // res.send("this should give me an error")
    },
    (req,res,next) => {
        console.log("Inside /user PART 2")
        next()
        // res.send("Handling route /user... ")
    },
    (req,res) => {
        console.log("Inside /user PART 3")
        res.send("Handling route /user... ")
    },
)

app.listen(3001, () => {
    console.log("Server is successfully listening on port 3001... ")
});