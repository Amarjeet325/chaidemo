import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";
import { upload } from "../middilewares/multer.middilewares.js";
//import { verify } from "jsonwebtoken";
import { verifyJWT } from '../middilewares/auth.middilewares';

const router=Router()
router.route("/register").post(
    upload.fields(
      [  {
          name:"avatar",
          maxCount:1
      },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post( verifyJWT, logoutUser)


export default router;