import { Router } from "express";
import validate from "../middleware/validate.js";
import { signinSchema, signupSchema, verifyCodeSchema } from "../validations/auth.validation.js";
import { signin, signup, verifyCode } from "../controllers/auth.controller.js";

const route = Router()

route.post("/signup", validate(signupSchema), signup)
route.post("/verifyCode", validate(verifyCodeSchema), verifyCode)
route.post("/signin", validate(signinSchema), signin)

export default route