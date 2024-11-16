const express = require("express")
const { connectDB } = require("./config/database")
const User = require("./models/user")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const connectionRequestRouter = require("./routes/request")

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter)
app.use("/profile", profileRouter)
app.use("/", connectionRequestRouter)

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

