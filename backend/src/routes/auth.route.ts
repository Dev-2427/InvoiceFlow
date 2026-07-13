import { Router } from "express";
import validate from "../middleware/validate.js";
import { changePasswordSchema, forgotPasswordSchema, passwordSchema, signinSchema, signupSchema, verifyCodeSchema } from "../validations/auth.validation.js";
import { changePassword, forgotPassword, refreshToken, resetPassword, signin, signout, signoutAllDevices, signup, verifyCode, verifyResetCode } from "../controllers/auth.controller.js";
import authCheck from "../middleware/authCheck.js";

const route = Router()

route.post("/signup", validate(signupSchema), signup)
route.post("/verifyCode", validate(verifyCodeSchema), verifyCode)
route.post("/signin", validate(signinSchema), signin)
route.post("/refreshToken", refreshToken)
route.post("/signout", authCheck, signout)
route.post("/signout-all", authCheck, signoutAllDevices)
route.post("/forgotPassword", validate(forgotPasswordSchema), forgotPassword)
route.post("/verifyResetCode", validate(verifyCodeSchema), verifyResetCode)
route.post("/resetPassword", validate(passwordSchema), resetPassword)
route.patch("/changePassword", validate(changePasswordSchema), authCheck, changePassword)

export default route