const express = require("express")

const app = express()

// This GET call will work for "abc" as well as "ac", basically anything before ? is optional
app.get("/ab?c", (req,res) => {
    res.send("Working with ? ")
});

// This GET call will work for "abc", "abbc" and so on...
app.get("/(ab)+c", (req,res) => {
    res.send("Working with + ")
});

// This GET call will work for "ab" + {anything} + "c"
app.get("/ab*c", (req,res) => {
    res.send("Working with * ")
});

app.get("/user/:userID/:name", (req,res) => {
    console.log(req.params)
    res.send("Working with * ")
});

app.get("/user", (req,res) => {
    console.log(req.query)
    res.send("Working with * ")
});

app.use((req,res) => {
    res.send("Hello from the server!")
});

app.listen(3001, () => {
    console.log("Server is successfully listening on port 3001... ")
});