import express from "express"
import { createListing } from "../controllers/listing.controller.js"
import { verifyUser } from "../middleware/auth.middleware.js"


const router = express.Router()

router.post("/create",verifyUser,createListing)

export default router