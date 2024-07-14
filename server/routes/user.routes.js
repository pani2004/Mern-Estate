import express from "express"
import { deleteUser, getUserListing, updateUser } from "../controllers/user.controller.js"
import { verifyUser } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post('/update/:id',verifyUser,updateUser)
router.delete('/delete/:id',verifyUser,deleteUser)
router.get('/listings/:id',verifyUser,getUserListing)
export default router

// 6683d51b6f29af397552b3ff