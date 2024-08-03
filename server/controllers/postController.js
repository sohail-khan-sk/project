const postModel = require("../models/postModel");

const createPostController = async(req, res) => {
    try {
        const {title, description} = req.body
        if(!title || !description){
            return res.status(500).send({
                success:false,
                message:"pls Provide all fields"
            })
        }
        const post = await postModel({
            title,
            description,
            postedBy:req.auth._id,
        }).save();
        res.status(201).send({
            success:true,
            message:"post createed successfully",
            post,
        })
        console.log(req);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in create post api",
            error
        })
    }
}

const getAllPostsController = async(req, res) => {
    try {
        const posts = await postModel.find().populate("postedBy","_id name" ).sort({createdAt : -1})
        res.status(200).send({
            success:true,
            message:"All Post Data",
            posts,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error In GETALLPOSTS API",
            error
        })
    }
};

const getUserPostController = async(req,res) => {
    try {
        const userPosts = await postModel.find({postedBy:req.auth._id})
        res.status(200).send({
            success:true,
            message:"user posts",
            userPosts,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in user post API",
            error
        })
    }
}

const deletePostController = async(req, res) => {
    try {
        const {id} = req.params
        await postModel.findByIdAndDelete({_id:id})
        res.status(200).send({
            success:true,
            message:"your post has been deleted"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in delete post api",
            error,
        })
    }
}

const updatePostController = async (req, res) => {
    try {
        const {title, description} = req.body
        const post = await postModel.findById({_id:req.params.id})

        if (!title || !description) {
            return res.status(500).send({
                success:false,
                message:"pls provide post title or descroption",
            })
        }
        const updatedPost = await postModel.findByIdAndUpdate({_id:req.params.id},{
            title:title || post?.title,
            description:description || post?.description
        },{new:true})
        res.status(200).send({
            success:true,
            message:"post updated successfully",
            updatedPost,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in update post API",
            error,
        })
    }
}

module.exports ={ createPostController, getAllPostsController, getUserPostController, deletePostController, updatePostController};