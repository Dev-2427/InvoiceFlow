import { Router } from "express";
import loadCurrentOrganization from "../middleware/loadCurrentOrganization.js";
import { getDashboardData } from "../controllers/dashboard.controller.js";

const route = Router()

route.get("/", getDashboardData)

export default route