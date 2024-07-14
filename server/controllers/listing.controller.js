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

export const updateListing = asyncHandler(async(req,res)=>{
    const listing = await Listing.findById(req.params.id)
    if(!listing){
     throw new ApiError(404,"Listing not found")
    }
    if(req.user.id !== listing.userRef.toString()){
        throw new ApiError(401,"You can update your own listing")
    }
    const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    return res.status(200).json(new ApiResponse(200,updatedListing,"Listing updated successfully"))
})

export const getListing = asyncHandler(async(req,res)=>{
    const listing = await Listing.findById(req.params.id)
    if(!listing){
        throw new ApiError(404,"Listing not found")
    }
    return res.status(200).json(new ApiResponse(200,listing,"Listing fetched successfully"))
})

export const getListings = asyncHandler(async(req,res)=>{
    try {
        const limit = parseInt(req.query.limit) || 9
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
          }
      
          let furnished = req.query.furnished;
      
          if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
          }
      
          let parking = req.query.parking;
      
          if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
          }
      
          let type = req.query.type;
      
          if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
          }
      
          const searchTerm = req.query.searchTerm || '';
      
          const sort = req.query.sort || 'createdAt';
      
          const order = req.query.order || 'desc';
      
          const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
          })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);
            return res.status(200).json(new ApiResponse(200,listings,"Searched successfully"))
    } catch (error) {
        throw new ApiError(500,"Internal server error")
    }
})