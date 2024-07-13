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
