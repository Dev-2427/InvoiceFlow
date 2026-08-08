import { Router } from "express";
import validate from "../middleware/validate.js";
import { changeClientStatusSchema, createClientSchema, deleteClientsSchema, getClientsSchema, updateClientSchema } from "../validations/client.validation.js";
import { changeClientStatus, createClient, deleteClients, getClientDetails, getClients, updateClient } from "../controllers/client.controller.js";
import loadCurrentOrganization from "../middleware/loadCurrentOrganization.js";

const route = Router()

route.post("/", validate(createClientSchema), createClient)
route.get("/get_clients", loadCurrentOrganization, getClients)
route.get("/:clientId", loadCurrentOrganization, getClientDetails)
route.patch("/status", loadCurrentOrganization, validate(changeClientStatusSchema), changeClientStatus)
route.patch("/:clientId", loadCurrentOrganization, validate(updateClientSchema), updateClient)
route.delete("/", loadCurrentOrganization, validate(deleteClientsSchema), deleteClients)

export default route