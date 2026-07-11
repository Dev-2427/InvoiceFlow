import type Mail from "nodemailer/lib/mailer/index.js"
import { env } from "../../config/env.js"
import transporter from "./transporter.js"

interface sendEmailOption {
    to: string,
    subject: string,
    html: string,
    text?: string,
    attachments?: Mail.Attachment[]
}

async function sendEmail({ to, subject, html, text, attachments }: sendEmailOption) {
    try {
        return await transporter.sendMail({
            from: `InvoiceFlow <${env.EMAIL_USER}>`,
            to,
            subject,
            html,
            text,
            attachments
        })
    } catch (error) {
        console.error("Failed to send email:", error)
        throw new Error("Failed to send email")
    }
}

export default sendEmail