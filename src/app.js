const express = require("express")
const { connectDB } = require("./config/database")
const User = require("./models/user")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const connectionRequestRouter = require("./routes/request")
const userRouter = require("./routes/user")
require('dotenv').config();

const app = express()
const port = process.env.PORT || 3001;

app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter)
app.use("/profile", profileRouter)
app.use("/", connectionRequestRouter)
app.use("/", userRouter)

connectDB()
    .then(() => {
        console.log("Database Connection established...")
        app.listen(port, () => {
            console.log("Server is successfully listening on port 3001... ")
        });
    })
    .catch((err) => {
        console.log("Database Connection couldn't be established...")
    })

