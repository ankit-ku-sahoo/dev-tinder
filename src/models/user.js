const mongoose = require("mongoose")
const validator = require("validator")

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
        validate(value) {
            if(!["M","F","Others"].includes(value)){
                throw("Gender data is not valid")
            }
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

const userModel = mongoose.model("User", userSchema)

module.exports = userModel