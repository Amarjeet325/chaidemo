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





export { app }   // <--OR --> export default app