import { Router } from "express";
import validate from "../middleware/validate.js";
import { signinSchema, signupSchema, verifyCodeSchema } from "../validations/auth.validation.js";
import { refreshToken, signin, signout, signoutAllDevices, signup, verifyCode } from "../controllers/auth.controller.js";
import authCheck from "../middleware/authCheck.js";

const route = Router()

route.post("/signup", validate(signupSchema), signup)
route.post("/verifyCode", validate(verifyCodeSchema), verifyCode)
route.post("/signin", validate(signinSchema), signin)
route.post("/refreshToken", refreshToken)
route.post("/signout", authCheck, signout)
route.post("/signout-all", authCheck, signoutAllDevices)

export default route