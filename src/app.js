const express = require("express")

const app = express()

app.use("/nodemon", (req,res) => {
    res.send("Nodemon is also working!! ")
});

app.use("/test", (req,res) => {
    res.send("This is for testing purpose... Voila, It's working!! ")
});

app.use((req,res) => {
    res.send("Hello from the server!")
});

app.listen(3001, () => {
    console.log("Server is successfully listening on port 3001... ")
});