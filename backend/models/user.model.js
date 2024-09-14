import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 email:{
    type: String,
    required: true,
    unique: true
},
password:{
    type:String,
    required: true,
},
name:{
    type:String,
    required:true
},
lastlogin:{
    type:Date,
    default:Date.now
},
isVerified:{
    type:Boolean,
    default:false
},
resetPassswordToken:String,
resetPassswordExpiresAt:Date,
verificationToken:String,
verificationTokenExpiresAt:Date,
},{timestamps:true}) // created at and updated at will be automatically added into document

export const User = mongoose.model('User', userSchema);

