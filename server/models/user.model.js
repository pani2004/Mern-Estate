import mongoose,{Schema} from "mongoose";
import { type } from "os";
const userSchema = new Schema({
   username:{
    type:String,
    required:true,
   },
   email:{
    type:String,
    required:true,
    unique:true
   },
   password:{
    type:String,
    required:true,
   },
},{timestamps:true})

export const User = mongoose.model("User",userSchema)