const validator = require("validator")

const validateUserSignups = (req) => {
    const {firstName, lastName, emailId, password } = req.body

    if(!firstName){
        throw new Error("Please enter a first name")
    } else if (!lastName) {
        throw new Error("Please enter a last name")
    }
    validatePassword(password)
}

const validatePassword = (password) => {
    if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password!")
    }
}

module.exports = { validateUserSignups, validatePassword }