const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require('dotenv').config();

const privateKey = process.env.TOKEN_PRIVATE_KEY || "DevTinder@690"
const tokenValidity = process.env.COOKIE_ACTIVITY_DURATION_SECONDS || 7*24*60*60

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
        maxLength: 50
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        maxLength: 100,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Not a valid email: " + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("Not a strong password!")
            }
        }
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 100
    },
    gender: {
        type: String,
        required: true,
        enum: {
            values: ["M", "F", "Others"],
            message: `{VALUE} is not a valid gender type`
        }
    },
    photoUrl: {
        type: String,
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Not a valid URL: " + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is about me!",
        maxLength: 1000
    },
    skills: {
        type: [String],
        validate(value) {
            const uniqueSkills = [...new Set(value)]
            if(uniqueSkills.length < value.length){
                throw new Error("Duplicate skills added. Please add unique skills only.")
            }
            if(value.length > 5){
                throw new Error("Too many skills added: " + value.length + ". Please add upto 5 skills.")
            }
        }
    }
}, {
    timestamps: true
})

userSchema.methods.getJWT = async function () {
    const user = this
    const token = await jwt.sign({_id: user._id}, privateKey, { expiresIn: tokenValidity})

    return token
}

userSchema.methods.validatePassword = async function (passwordByUser) {
    const user = this

    const passwordHash = user.password
    const isPasswordCorrect = await bcrypt.compare(passwordByUser, passwordHash)
    return isPasswordCorrect
}

const userModel = mongoose.model("User", userSchema)

module.exports = userModel