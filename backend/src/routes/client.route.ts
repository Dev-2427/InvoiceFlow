import { Router } from "express";
import validate from "../middleware/validate.js";
import { createClientSchema, deleteClientsSchema, updateClientSchema } from "../validations/client.validation.js";
import { createClient, deleteClients, getClientDetails, updateClient } from "../controllers/client.controller.js";
import loadCurrentOrganization from "../middleware/loadCurrentOrganization.js";

const route = Router()

route.post("/", validate(createClientSchema), createClient)
route.get("/:clientId", loadCurrentOrganization, getClientDetails)
route.patch("/:clientId", loadCurrentOrganization, validate(updateClientSchema), updateClient)
route.delete("/", loadCurrentOrganization, validate(deleteClientsSchema), deleteClients)

export default route