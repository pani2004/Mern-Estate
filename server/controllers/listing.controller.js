import asyncHandler from "../utils/asyncHandler.js";
import {Listing} from "../models/listing.model.js"
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
export  const createListing = asyncHandler(async(req,res)=>{
    const listing = await Listing.create(req.body)
    if(listing){
        res.status(200).json(new ApiResponse(200,listing,"Listing created successfully"))
    }
    else{
        throw new ApiError(500,"Internal server error")
    }
})