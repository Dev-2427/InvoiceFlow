import { Router } from "express";
import validate from "../middleware/validate.js";
import { changePasswordSchema, forgotPasswordSchema, googleAuthSchema, passwordSchema, signinSchema, signupSchema, verifyCodeSchema } from "../validations/auth.validation.js";
import { changePassword, forgotPassword, googleAuth, me, refreshToken, resetPassword, signin, signout, signoutAllDevices, signoutSession, signup, verifyCode, verifyResetCode } from "../controllers/auth.controller.js";
import authCheck from "../middleware/authCheck.js";

const route = Router()

route.post("/signup", validate(signupSchema), signup)
route.post("/verify-email", validate(verifyCodeSchema), verifyCode)
route.post("/signin", validate(signinSchema), signin)
route.post("/google", validate(googleAuthSchema), googleAuth)

route.post("/refresh", refreshToken)
route.post("/signout", authCheck, signout)
route.post("/signout-all", authCheck, signoutAllDevices)
route.delete("/signout-session/:sessionId", authCheck, signoutSession)

route.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword)
route.post("/verify-reset-code", validate(verifyCodeSchema), verifyResetCode)
route.post("/reset-password", validate(passwordSchema), resetPassword)

route.patch("/change-password", validate(changePasswordSchema), authCheck, changePassword)

route.get("/me", authCheck, me)

export default route