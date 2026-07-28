import { Router } from "express";
import validate from "../middleware/validate.js";
import { createClientSchema } from "../validations/client.validation.js";
import { createClient } from "../controllers/client.controller.js";

const route = Router()

route.post("/", validate(createClientSchema), createClient)

export default route