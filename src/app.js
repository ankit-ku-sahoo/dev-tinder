const express = require("express")

const app = express()

// This will handle only GET Calls to /nodemon
app.get("/nodemon", (req,res) => {
    res.send("Nodemon is also working!! ")
});

app.get("/user", (req,res) => {
    res.send({"firstname": "Ankit Kumar", "lastname": "Sahoo"})
});

app.post("/user", (req,res) => {
    res.send("Successfully saved data to DB...")
});

app.delete("/user", (req,res) => {
    res.send("Successfully deleted data from DB...")
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