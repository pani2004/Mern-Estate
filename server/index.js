import dotenv from "dotenv"
import connectDb from "./db/index.js"
import path from "path"
import express from "express"
import userRouter from "./routes/user.routes.js"
import authRouter from "./routes/auth.routes.js"
import listingRouter from "./routes/listing.routes.js"
import cookieParser from "cookie-parser"
const app = express()
dotenv.config({
    path:'./.env'
})

app.use(express.json())
app.use(cookieParser())
app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)
app.use("/api/listing",listingRouter)
const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  })
connectDb().then(()=>{
    app.listen(3000,()=>{
        console.log("Server is running on port 3000")
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed",err)
})
