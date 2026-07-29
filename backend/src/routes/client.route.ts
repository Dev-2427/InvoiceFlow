import { Router } from "express";
import validate from "../middleware/validate.js";
import { createClientSchema, updateClientSchema } from "../validations/client.validation.js";
import { createClient, getClientDetails, updateClient } from "../controllers/client.controller.js";
import loadCurrentOrganization from "../middleware/loadCurrentOrganization.js";

const route = Router()

route.post("/", validate(createClientSchema), createClient)
route.get("/:clientId", loadCurrentOrganization, getClientDetails)
route.patch("/:clientId", loadCurrentOrganization, validate(updateClientSchema), updateClient)

export default route