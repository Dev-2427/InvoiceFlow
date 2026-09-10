interface InvoiceEmailTemplateData {
    clientName: string
    invoiceNumber: string
    issueDate: string
    dueDate: string
    totalAmount: string
    currencySymbol: string
    status: "draft" | "unpaid" | "paid" | "overdue"
}

function invoiceEmailTemplate({
    clientName,
    invoiceNumber,
    issueDate,
    dueDate,
    totalAmount,
    currencySymbol,
    status
}: InvoiceEmailTemplateData) {

    const isPaid = status === "paid"

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoiceNumber}</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  font-family: Arial, Helvetica, sans-serif;
  color: #333333;
">

  <div style="
    max-width: 600px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
  ">

    <div style="
      padding: 24px;
      border-bottom: 1px solid #eeeeee;
    ">
      <h2 style="margin: 0;">InvoiceFlow</h2>
    </div>

    <div style="padding: 32px 24px;">

      <p style="margin-top: 0;">
        Hello ${clientName},
      </p>

      <p>
        Please find your invoice
        <strong>${invoiceNumber}</strong>
        attached to this email.
      </p>

      <table style="
        width: 100%;
        border-collapse: collapse;
        margin: 24px 0;
      ">

        <tr>
          <td style="padding: 10px 0; color: #666666;">
            Invoice Number
          </td>
          <td style="padding: 10px 0; text-align: right;">
            <strong>${invoiceNumber}</strong>
          </td>
        </tr>

        <tr>
          <td style="padding: 10px 0; color: #666666;">
            Issue Date
          </td>
          <td style="padding: 10px 0; text-align: right;">
            ${issueDate}
          </td>
        </tr>

        <tr>
          <td style="padding: 10px 0; color: #666666;">
            Due Date
          </td>
          <td style="padding: 10px 0; text-align: right;">
            ${dueDate}
          </td>
        </tr>

        ${!isPaid
            ? `
            <tr>
              <td style="
                padding: 14px 0;
                border-top: 1px solid #eeeeee;
                font-weight: bold;
              ">
                Amount Due
              </td>
              <td style="
                padding: 14px 0;
                border-top: 1px solid #eeeeee;
                text-align: right;
                font-weight: bold;
              ">
                ${currencySymbol}${totalAmount}
              </td>
            </tr>
          `
            : ""
        }

      </table>

      ${isPaid
            ? `
          <p>
            This invoice has been marked as
            <strong>paid</strong>.
          </p>
        `
            : `
          <p>
            Please make the payment by the due date.
          </p>
        `
        }

      <p style="margin-bottom: 0;">
        Thank you,
      </p>

      <p style="margin-top: 4px;">
        <strong>InvoiceFlow</strong>
      </p>

    </div>

    <div style="
      padding: 20px 24px;
      background-color: #fafafa;
      border-top: 1px solid #eeeeee;
      font-size: 12px;
      color: #888888;
      text-align: center;
    ">
      This is an automated email. Please do not reply directly
      to this email.
    </div>

  </div>

</body>
</html>
`

    const text = `
Hello ${clientName},

Please find your invoice ${invoiceNumber} attached to this email.

Invoice Number: ${invoiceNumber}
Issue Date: ${issueDate}
Due Date: ${dueDate}
${!isPaid ? `Amount Due: ${currencySymbol}${totalAmount}` : ""}

${isPaid
            ? "This invoice has been marked as paid."
            : "Please make the payment by the due date."
        }

Thank you,
    InvoiceFlow
        `

    return { html, text }
}

export default invoiceEmailTemplate