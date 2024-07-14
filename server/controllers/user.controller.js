import { Listing } from "../models/listing.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcryptjs from 'bcryptjs'

export const updateUser = asyncHandler(async(req,res)=>{
    if(req.user.id !== req.params.id)
        return new ApiError(401,"You can only update your own account")
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10)
        }
        const updateduser = await User.findByIdAndUpdate(req.params.id,
            {
                $set:{
                    username:req.body.username,
                    email:req.body.email,
                    password:req.body.password,
                    avatar:req.body.avatar
                }
            },{new:true}
        ).select("-password")
        return res.status(200).json(new ApiResponse(200,updateduser,"Account details updated successfully"))
    } catch (error) {
    }
})

export const deleteUser = asyncHandler(async(req,res)=>{
    if(req.user.id!== req.params.id)
    throw new ApiError(401,"You can only delete your own account")
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if(deleteUser){
        return res.clearCookie("access_token").status(200).json(new ApiResponse(200,deletedUser,"User deleted"))
    }
    else{
        throw new ApiError(501,"Internal Server error")
    }
})

export const getUserListing = asyncHandler(async(req,res)=>{
    if(req.user.id === req.params.id){
      try {
        const listings = await Listing.find({userRef:req.params.id})
        return res.status(200).json(new ApiResponse(200,listings,"Successfully fetched"))
      } catch (error) {
        throw new ApiError(500,error)
      }
    }
    else{
        throw new ApiError(401,"You can only view your own listing")
    }
})

export const getUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        throw new ApiError(404,"User not found")
    }
    const {password: pass, ...rest} = user._doc
    return res.status(200).json(new ApiResponse(200,rest,"User fetched successfully"))
})