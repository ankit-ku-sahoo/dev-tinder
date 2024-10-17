const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://10ankitkusahoo10:admin@dev-tinder-cluster.8jajt.mongodb.net/devTinder"
    )
}

module.exports = {
    connectDB
}