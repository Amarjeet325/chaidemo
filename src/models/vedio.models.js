import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

 const vedioSchema =new Schema(
    {
      vediofile:{
        type:String,  // cloudinary url
        required:true,
      },
      thumbnail:{    //// cloudinary url
        type:String,  
        required:true,
      },
      title:{
        type:String,  
        required:true,
      },
      discribtion:{
        type:String,  
        required:true,
      },
      duration:{
        type:Number,  // cloudinary url
        required:true,
      },
      view:{
        type:Number, 
       default:0
      },
      isPublished:{
        type:Boolean,
        default:true,
      },
       owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
       }


    },
    {
        timestamps:true
    }
 )
  
 vedioSchema.plugin(mongooseAggregatePaginate);

export  const Vedio =mongoose.model("Vedio",VedioSchema);