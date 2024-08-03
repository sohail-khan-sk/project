const JWT = require('jsonwebtoken')
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModule = require("../models/userModule")
var { expressjwt : jwt } = require("express-jwt")

const requireSingIn = jwt({
    secret:process.env.JWT_SECRET, 
    algorithms: ["HS256"],
})

const registerController = async (req,res) =>{
    try {
        const {name,email,password} = req.body
        if (!name) {
            return res.status(400).send({
                success:false,
                message:"name is required"
            })
        }
        if (!email) {
            return res.status(400).send({
                success:false,
                message:"email is required"
            })
        }
        if (!password || password.length < 6) {
            return res.status(400).send({
                success:false,
                message:"password is required and must be 6 character"
            })
        }

        const exisitingUser = await userModule.findOne({email})
        if (exisitingUser) {
            return res.status(500).send({
                success:false,
                message:"user already register with this email"
            })
        }

        const hashedPassword = await hashPassword(password);

        const user = await userModule({name,email,password:hashedPassword}).save();

        return res.status(201).send({
            success:true,
            message:"registration succesfull pls login"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"error in register API",
            error,
        })
    }
};

const loginController = async (req,res) =>{
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(500).send({
                success:false,
                message:"pls provide email or password"
            })
        }

        const user = await userModule.findOne({email})
        if (!user) {
            return res.status(500).send({
                success:false,
                message:"user not found"
            })
        }

        const match = await comparePassword(password,user.password)
        if (!match) {
            return res.status(500).send({
                success:false,
                message:"incorrect username or password"
            })
        }

        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

        user.password = undefined;

        res.status(200).send({
            success:true,
            message:"login succcessfully",
            token,
            user,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"error in login in api",
            error
        })
    }
};

const updateUserController = async(req,res) =>{
    try {
        const {name, password, email} = req.body
        
        const user = await userModule.findOne({email})
        if(password && password.length < 6){
            return res.status(400).send({
                success:false,
                message:"password is required and should be 6 character long"
            })
        }
        const hashedPassword = password ? await hashPassword(password): undefined

        const updatedUser = await userModule.findOneAndUpdate({email}, {name:name || user.name,
            password : hashedPassword || user.password
        },{new:true})

        updatedUser.password = undefined;

        res.status(200).send({
            success:true,
            message:"profile updated pls login",
            updatedUser,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in user update api",
            error
        })
    }
}

module.exports = {requireSingIn, registerController, loginController, updateUserController };