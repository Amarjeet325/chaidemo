import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { jwt } from 'jsonwebtoken';
import { User } from "../models/user.models.js";



export const verifyJWT= asyncHandler(async(req,resp,next)=>{
  try {
    
  const token= req.cookies?.accessToken || req.header("Authorizatio")?.replace("Bearer","")
  
    if (!token) {
        throw new ApiError(401,"unauthorised user request");   
    }
    const decodedToken = jwt.verifyJWT(token,process.env.REFRESH_TOKEN_SECRET);
     
    const user=  await User.findById(decodedToken?._id).select("-password -refreshToken")

    if (!user) {
      throw new ApiError(401,"invalid accessToken");
    }

    req.user=user;
    next();
  }
  catch (error) {
    throw new ApiError(401,error?.massage|| "invalid  accessToken");
    
  }

})
export { verifyJWT}