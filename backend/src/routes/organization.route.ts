import { Router } from "express";
import authCheck from "../middleware/authCheck.js";
import { createOrganization, deleteOrganization, getOrganization, getOrganizations, removeLogo, switchOrganization, updateLogo, updateOrganization } from "../controllers/organization.controller.js";
import validate from "../middleware/validate.js";
import { createOrganizationSchema, updateOrganizationSchema } from "../validations/organization.validation.js";
import upload from "../middleware/upload.js";
import loadCurrentOrganization from "../middleware/loadCurrentOrganization.js";

const route = Router()

route.post("/", validate(createOrganizationSchema), createOrganization)
route.get("/", getOrganizations)
route.get("/:organizationId", getOrganization)
route.patch("/:organizationId", validate(updateOrganizationSchema), updateOrganization)
route.patch("/:organizationId/logo", upload.single("logo"), updateLogo)
route.patch("/switch/:organizationId", switchOrganization)
route.delete("/:organizationId/logo", removeLogo)
route.delete("/:organizationId", deleteOrganization)

export default route