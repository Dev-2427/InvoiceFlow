function verificationTemplate(
    firstName: string,
    verificationCode: string
  ) {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
  >
  <title>Email Verification</title>
  </head>
  
  <body
  style="
  margin:0;
  padding:0;
  background:#f5f7fb;
  font-family:Arial,Helvetica,sans-serif;
  ">
  
  <table
  role="presentation"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="padding:40px 20px;"
  >
  
  <tr>
  
  <td align="center">
  
  <table
  role="presentation"
  width="620"
  cellpadding="0"
  cellspacing="0"
  style="
  background:#ffffff;
  border:1px solid #e5e7eb;
  border-radius:18px;
  overflow:hidden;
  "
  >
  
  <tr>
  
  <td
  style="
  padding:48px 48px 24px;
  text-align:center;
  "
  >
  
  <div
  style="
  display:inline-block;
  padding:10px 18px;
  background:#eff6ff;
  border-radius:999px;
  color:#2563eb;
  font-size:14px;
  font-weight:bold;
  "
  >
  InvoiceFlow
  </div>
  
  <h1
  style="
  margin:24px 0 10px;
  font-size:30px;
  font-weight:700;
  color:#111827;
  "
  >
  Verify your email
  </h1>
  
  <p
  style="
  margin:0;
  font-size:16px;
  line-height:28px;
  color:#6b7280;
  "
  >
  Secure your account by confirming your email address.
  </p>
  
  </td>
  
  </tr>
  
  <tr>
  
  <td
  style="
  padding:0 48px;
  "
  >
  
  <p
  style="
  margin:0;
  font-size:16px;
  line-height:28px;
  color:#374151;
  "
  >
  Hi <strong>${firstName}</strong>,
  </p>
  
  <p
  style="
  margin:20px 0 0;
  font-size:16px;
  line-height:28px;
  color:#4b5563;
  "
  >
  Welcome to InvoiceFlow! Use the verification code below to complete your account setup.
  </p>
  
  <div
  style="
  margin:40px 0;
  padding:28px;
  border:2px dashed #bfdbfe;
  border-radius:14px;
  background:#f8fbff;
  text-align:center;
  "
  >
  
  <div
  style="
  font-size:14px;
  color:#6b7280;
  margin-bottom:12px;
  letter-spacing:1px;
  "
  >
  YOUR VERIFICATION CODE
  </div>
  
  <div
  style="
  font-size:40px;
  font-weight:700;
  letter-spacing:10px;
  color:#2563eb;
  "
  >
  ${verificationCode}
  </div>
  
  </div>
  
  <table
  role="presentation"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="
  background:#f9fafb;
  border-radius:12px;
  "
  >
  
  <tr>
  
  <td
  style="
  padding:18px 22px;
  font-size:15px;
  line-height:26px;
  color:#4b5563;
  "
  >
  
  <strong style="color:#111827;">
  ⏳ Expires in 10 minutes
  </strong>
  
  <br>
  
  For your security, never share this code with anyone.
  
  </td>
  
  </tr>
  
  </table>
  
  <p
  style="
  margin:32px 0 0;
  font-size:15px;
  line-height:26px;
  color:#6b7280;
  "
  >
  If you didn't create an account with InvoiceFlow, you can safely ignore this email.
  </p>
  
  </td>
  
  </tr>
  
  <tr>
  
  <td
  style="
  padding:40px 48px;
  "
  >
  
  <hr
  style="
  border:none;
  border-top:1px solid #e5e7eb;
  margin:0 0 24px;
  "
  >
  
  <p
  style="
  margin:0;
  text-align:center;
  font-size:13px;
  line-height:24px;
  color:#9ca3af;
  "
  >
  This is an automated email. Please do not reply.
  </p>
  
  <p
  style="
  margin:8px 0 0;
  text-align:center;
  font-size:13px;
  color:#9ca3af;
  "
  >
  © ${new Date().getFullYear()} InvoiceFlow. All rights reserved.
  </p>
  
  </td>
  
  </tr>
  
  </table>
  
  </td>
  
  </tr>
  
  </table>
  
  </body>
  </html>
  `;
  }
  
  export default verificationTemplate;