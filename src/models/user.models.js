import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema=new Schema(
    {
      username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true

      },
      email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
       
      },
      fullName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
       
      },
      password:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
      },
      avatar:{
        type:String,
        required:true
      },
      coverImage:{
        type:String,
        required:true
      },
      watchHistory:{
        type:Schema.Types.ObjectId,
        ref:"Vedio"
      }

    },
    {
        timestamps:true
    }
)
//password encription ke liye -----
 userSchema.pre("save",async function(next){
   if(!this.isModified("password")) return next();

   this.password=bcrypt.hash(this.password,10)
    next();

 })

 userSchema.methods.isPasswordCorrect=async function(password)
 {
 return await bcrypt.compare(password,this.password)
}
//-------------------jwt toke use kar rahe hai-----

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
    {  //payload likhate hai
        _id:this._id,
        email:this.email,
        fullName:this.fullName,
        username:this.username,

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }   
)
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {  //payload likhate hai
            _id:this._id,
    
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }   
    )


}






export  const User =mongoose.model("User",userSchema);