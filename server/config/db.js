const mongoose = require("mongoose")
const colors = require('colors')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Database connected ${mongoose.Connection.host}`)
    } catch (error) {
        console.log(`error in DB connection ${error}`.bgGreen.white);
    }
}

module.exports = connectDB;