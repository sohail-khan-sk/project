const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"pls add post title"]
    },
    description:{
        type:String,
        required:[true,"pls add post description"]
    },
    postedBy:{
        type:String,
        ref:"User",
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model("Post", postSchema)