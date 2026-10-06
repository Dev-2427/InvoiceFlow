import express from "express"
import { env } from "./config/env.js"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser";
import { getDBStatus } from "./config/database.js";
import authRouter from "./routes/auth.route.js"
import organizationRouter from "./routes/organization.route.js"
import clientRouter from "./routes/client.route.js"
import invoiceRouter from "./routes/invoice.route.js"
import authCheck from "./middleware/authCheck.js"
import loadCurrentOrganization from "./middleware/loadCurrentOrganization.js"
import "./services/cron/invoiceCleanup.js"
import "./services/cron/invoiceOverdueStatus.js"
import dashboardRouter from "./routes/dashboard.route.js"
import reportsRouter from "./routes/reports.route.js"
import userRouter from "./routes/user.route.js"

const app = express()

app.use(helmet())
app.use(morgan("common"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: env.NODE_ENV === "development" ? "http://localhost:5173" : env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}))

app.get("/health", (_, res) => {
    const connected = getDBStatus()
    return res
        .status(connected ? 200 : 500)
        .json({ success: connected, message: connected ? "Connected" : "Failed" })
})

app.use("/api/auth", authRouter)
app.use("/api/organization", authCheck, organizationRouter)
app.use("/api/client", authCheck, clientRouter)
app.use("/api/invoice", authCheck, loadCurrentOrganization, invoiceRouter)
app.use("/api/dashboard", authCheck, loadCurrentOrganization, dashboardRouter)
app.use("/api/reports", authCheck, loadCurrentOrganization, reportsRouter)
app.use("/api/profile", authCheck, userRouter)

export default app