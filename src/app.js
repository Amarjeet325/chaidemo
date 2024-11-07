import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app=express()  //methods banate hai

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

// get data from form,url,assets,cookies

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({ extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//   router imports-----------
import userRouter from "./routes/user.routes.js"


  // router declaration

  app.use("/api/v1/users",userRouter)

 // http:localhost:4000/api/v1/users/register; aise browser par call hoga


export { app }   // <--OR --> export default app