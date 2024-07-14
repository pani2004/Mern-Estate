import asyncHandler from "../utils/asyncHandler.js";
import { Listing } from "../models/listing.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const createListing = asyncHandler(async (req, res) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(200).json(new ApiResponse(200, listing, "Listing created successfully"));
        console.log(listing)
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map((val) => val.message);
            throw new ApiError(400, errorMessage.join(', '));
        }
        throw new ApiError(500, "Internal server error");
    }
});

export const deleteListing = asyncHandler(async(req,res)=>{
    const listing = await Listing.findById(req.params.id)
    if(!listing){
        throw new ApiError(404,"Listing not found")
    }
    if(req.user.id!==listing.userRef.toString()){
        throw new ApiError(401,"You can only delete your own listing")
    }
    const deletedListing = await Listing.findByIdAndDelete(req.params.id)
    return res.status(200).json(new ApiResponse(200,deletedListing,"Listing deleted"))
})