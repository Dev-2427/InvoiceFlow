import { Router } from "express";
import { getDashboardData, getRevenueAndReceiptsData } from "../controllers/dashboard.controller.js";

const route = Router()

route.get("/", getDashboardData)
route.get("/revenue_receipts", getRevenueAndReceiptsData)

export default route