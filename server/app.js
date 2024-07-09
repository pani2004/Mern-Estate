import express from "express"
import userRouter from "./routes/user.routes.js"
import authRouter from "./routes/auth.routes.js"
import listingRouter from "./routes/listing.routes.js"
import cookieParser from "cookie-parser"
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)
app.use("/api/listing",listingRouter)
export default app