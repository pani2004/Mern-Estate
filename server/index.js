import express from "express"
import dotenv from "dotenv"
import connectDb from "./db/index.js"
import app from "./app.js"
dotenv.config({
    path:'./.env'
})
connectDb().then(()=>{
    app.listen(3000,()=>{
        console.log("Server is running on port 3000")
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed",err)
})
