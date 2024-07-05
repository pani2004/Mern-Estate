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