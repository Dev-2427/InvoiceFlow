import { Router } from "express";
import { getReports } from "../controllers/reports.controller.js";

const route = Router()

route.get("/", getReports)

export default route