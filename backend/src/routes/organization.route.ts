import { Router } from "express";
import authCheck from "../middleware/authCheck.js";
import { createOrganization, getOrganization, getOrganizations } from "../controllers/organization.controller.js";
import validate from "../middleware/validate.js";
import { createOrganizationSchema } from "../validations/organization.validation.js";

const route = Router()

route.post("/", authCheck, validate(createOrganizationSchema), createOrganization)
route.get("/", authCheck, getOrganizations)
route.get("/:organizationId", authCheck, getOrganization)

export default route