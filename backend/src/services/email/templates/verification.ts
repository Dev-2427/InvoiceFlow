function verificationTemplate(
    firstName: string,
    verificationCode: string
) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Email Verification</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
<tr>
<td align="center" style="padding:40px 20px;">

<table role="presentation" width="600" cellspacing="0" cellpadding="0"
style="background:#ffffff;border-radius:12px;padding:40px;">

<tr>
<td>

<h1
style="
margin:0;
font-size:28px;
color:#111827;
text-align:center;
">
InvoiceFlow
</h1>

<p
style="
margin-top:30px;
font-size:16px;
color:#374151;
">
Hi ${firstName},
</p>

<p
style="
font-size:16px;
line-height:1.6;
color:#374151;
">
Thanks for signing up.

Please use the verification code below to verify your email address.
</p>

<div
style="
margin:35px 0;
text-align:center;
">
<span
style="
display:inline-block;
padding:18px 32px;
font-size:34px;
font-weight:bold;
letter-spacing:8px;
background:#2563eb;
color:white;
border-radius:10px;
">
${verificationCode}
</span>
</div>

<p
style="
font-size:15px;
line-height:1.6;
color:#6b7280;
">
This code will expire in <strong>10 minutes</strong>.
</p>

<p
style="
font-size:15px;
line-height:1.6;
color:#6b7280;
">
If you didn't create an account, you can safely ignore this email.
</p>

<hr
style="
border:none;
border-top:1px solid #e5e7eb;
margin:35px 0;
">

<p
style="
font-size:13px;
color:#9ca3af;
text-align:center;
margin:0;
">
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