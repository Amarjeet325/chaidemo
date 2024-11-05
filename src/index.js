
//require ('dotenv').config({path:'./env'}) ---- --OR---
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/index.js';

connectDB()


/*
// effies ka use kar rahe hai better aproach---------method 2 databse connection
import mongoose from "mongoose";
require('dotenv') .config();
import { DB_NAME } from "./constants.js";
import express from'expres';
import connectDB from './db/index';
const app=express();
(async()=>{
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error",(error)=>{
        console.log("ERROR:",error);
        throw error
        
    })
    app.listen((process.env.PORT),()=>{
        console.log(`App is listening on port ${process.env.PORT}`)
    })

  } catch (error) {
    console.log("EROOR IS:",error)
    throw error
  }
})

()
*/