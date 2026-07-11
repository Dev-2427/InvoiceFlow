import { Router } from "express";
import validate from "../middleware/validate.js";
import { signupSchema } from "../validations/auth.validation.js";
import { signup } from "../controllers/auth.controller.js";

const route = Router()

route.post("/signup", validate(signupSchema), signup)

export default route