import { Router } from "express";
import authCheck from "../middleware/authCheck.js";
import { createOrganization, getOrganization, getOrganizations, removeLogo, updateLogo, updateOrganization } from "../controllers/organization.controller.js";
import validate from "../middleware/validate.js";
import { createOrganizationSchema, updateOrganizationSchema } from "../validations/organization.validation.js";
import upload from "../middleware/upload.js";

const route = Router()

route.post("/", authCheck, validate(createOrganizationSchema), createOrganization)
route.get("/", authCheck, getOrganizations)
route.get("/:organizationId", authCheck, getOrganization)
route.patch("/:organizationId", authCheck, validate(updateOrganizationSchema), updateOrganization)
route.patch("/:organizationId/logo", authCheck, upload.single("logo"), updateLogo)
route.delete("/:organizationId/logo", authCheck, removeLogo)

export default route