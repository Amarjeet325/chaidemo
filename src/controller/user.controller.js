
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models";
import { uploadOnCloudinary } from "../models/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser=asyncHandler(async(req,resp)=>{
    // resp.status(200).json({
    //      massage:"ok successfully connected postman"
    // })

// ------registration user steps following   ---

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

     return resp.status(201).json{
        new ApiResponse(200,createdUser,"user registered succefully")
     }


})

export { registerUser }