import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const verifyUser = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies.access_token
        if(!token){
            throw new ApiError(401, "Unauthorized request: No token provided");
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken?.id).select("-password");  
        if (!user) {
            throw new ApiError(401, "Unauthorized request: User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(`JWT verification error: ${error.message}`); 
        throw new ApiError(401, error?.message || "Unauthorized request: Invalid access token");
    }
})