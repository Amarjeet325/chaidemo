
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../models/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// generating access and refesh Token for users-----

const generateAccessAndRefreshToken=async (userId)=>{

try {
   const user=await User.findById(userId)
   const accessToken=user.generateAccessToken()
   const refreshToken=user.generateRefreshToken()
    
   user.refreshToken=refreshToken
   await user.save({ValidateBeforeSave:false})

   return {refreshToken,accessToken}

} catch (error) {
   throw new ApiError(500,"something went wrong while generating Access and Refresh Token");
   
}

}

//---STEPS FOLLOW ------registration user steps following   ---

const registerUser=asyncHandler(async(req,resp)=>{
    // resp.status(200).json({
    //      massage:"ok successfully connected postman"
    // })


const {email,username,fullName,password}=req.body
    console.log("username",username)

    if (
        [email,username,fullName,password].some((field)=>field?.trim()==="")
    ) {
        throw new ApiError(400,"all fields are required");       
    }
   
    const existedUser=User.findOne({
        $or:[{username},{email}]
     })
    if (!existedUser) {
        throw new ApiError(409,"username and email allready exits");
        
    }

    const avtarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
     if (!avtarLocalPath) {
        throw new ApiError(403,"avatar is required");
        
     }

     const avatar= await uploadOnCloudinary(avtarLocalPath);
     const coverImage= await uploadOnCloudinary(coverImageLocalPath);

     if (!avatar) {
        throw new ApiError(403,"avatar is required");
        
     }

     const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
        email,
        username: username.toLowerCase()  
    });
    
     const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
     )
     
     if (!createdUser) {
        throw new ApiError(500,"something went wrong while registering the users");
        
     }

     return resp.status(201).json(
        new ApiResponse(200,createdUser,"user registered succefully")
     )


})


//----------loginUser ke liye steps hai
const loginUser=asyncHandler(async(req,resp)=>{

   const {username,email,password}=req.body

   if (!username || !email) {
    throw new ApiError(400,"username and email both are required");   
   }

   const user=await User.findOne({
      $or:[{username},{email}]
   })
   if (!user) {
      throw new ApiError(404,"user does not exits");
   }

   const isPasswordValid=await isPasswordCorrect(password)

   if ( !isPasswordValid) {
      throw new ApiError(401,"invalid user credentials");
   }

   const{refreshToken,accessToken}= await generateAccessAndRefreshToken(user._id)
  const loggedInUser = await User.findById(user._id).
  select("-password -refreshToken")
  
  const option={
      httpOnly:true,
      secure:true
  }
  return resp.status(200)
  .cookie("accessToken",accessToken,option)
  .cookie("refreshToken",refreshToken,option)
  .json(
   200,
   new ApiResponse,(
      200,
      {
          user:loggedInUser,refreshToken,accessToken
      },
      "user successfully logged In"
    ) )
})

// -----------userLoggedOut steps operation
const logOutUser=asyncHandler(async(req,resp)=>{
User.findByIdAndUpdate({
   req.user._id,
   {
       $set:
     {
         refreshToken=undefined
       },{
         return=true
       }
   }
   const option={
      httpOnly:true,
      secure:true
  }

  return resp
  .status(200)
  .clearCookies("accessToken",option)
  .clearCookies("refreshToken",option)
  .json(
   200,
   new ApiResponse,(
      200,
      {},
      "user successfully loggedOut In"
    ) )
  
})

})





export { registerUser,loginUser }