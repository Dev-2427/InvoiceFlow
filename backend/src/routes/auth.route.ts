import { Router } from "express";
import validate from "../middleware/validate.js";
import { signupSchema, verifyCodeSchema } from "../validations/auth.validation.js";
import { signup, verifyCode } from "../controllers/auth.controller.js";

const route = Router()

route.post("/signup", validate(signupSchema), signup)
route.post("/verifyCode", validate(verifyCodeSchema), verifyCode)

export default route