import express from "express"
import { updateUser } from "../controllers/user.controller.js"
import { verifyUser } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post('/update/:id',verifyUser,updateUser)

export default router

// 6683d51b6f29af397552b3ff