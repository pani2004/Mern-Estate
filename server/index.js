import express from "express"
import dotenv from "dotenv"
import connectDb from "./db/index.js"
const app = express()
dotenv.config({
    path:'./.env'
})
connectDb()
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})