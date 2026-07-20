import { Router } from "express";
import authCheck from "../middleware/authCheck.js";
import { createOrganization } from "../controllers/organization.controller.js";
import validate from "../middleware/validate.js";
import { createOrganizationSchema } from "../validations/organization.validation.js";

const route = Router()

route.post("/", authCheck, validate(createOrganizationSchema), createOrganization)

export default route