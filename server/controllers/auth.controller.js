import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypytjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
export const signup = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body
    const hashedpassword = bcrypytjs.hashSync(password,10)
    const newUser = new User({username,email,password:hashedpassword})
    if (!username || !email || !password) {
        throw new ApiError(400, "All fields are required");
     }
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User already exists")
    }
        await newUser.save()
         res.status(201).json(
         new ApiResponse(200,"User registered successfully")
        )
})
export const signin = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    
        const validUser = await User.findOne({email})
        if(!validUser){
            throw new ApiError(404,"User not found")
        }
        const validPassword = bcrypytjs.compareSync(password,validUser.password)
        if(!validPassword){
            throw new ApiError(401,"Invalid credentials")
        }
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET)
        const {password:pass, ...rest} = validUser._doc
        res
        .cookie('access_token',token,{httpOnly:true}) 
        .status(200)
        .json(new ApiResponse(200,rest,"User logged in successfully"))
})

export const google = asyncHandler(async(req,res)=>{
    const user = await User.findOne({email:req.body.email})
    if(user){
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        const {password:pass,...rest} = user._doc
        res
        .cookie('access_token',token,{httpOnly:true})
        .status(200)
        .json(new ApiResponse(200,rest,"User logged in successfully"))
    }
    else{
        const generatedPassword = Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
        const hashedpassword = bcrypytjs.hashSync(generatedPassword,10)
        const newUser = new User(
            {
                username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),
                email:req.body.email,
                password:hashedpassword,
                avatar:req.body.photo
            }
        )
        await newUser.save()
        const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)
        const{password:pass,...rest} = newUser._doc
        res
        .cookie('access_token',token,{httpOnly:true})
        .status(200)
        .json(new ApiResponse(200,rest,"User registered successfully"))
    }
})