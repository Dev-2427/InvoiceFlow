import { OAuth2Client } from "google-auth-library";
import { env } from "./env.js";

export const googleClient = new OAuth2Client({
    client_id: env.GOOGLE_CLIENT_ID!,
    client_secret: env.GOOGLE_CLIENT_SECRET!
})