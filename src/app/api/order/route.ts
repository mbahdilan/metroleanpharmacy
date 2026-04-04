import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// Configure Nodemailer for Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'office@metrolean.com',
    pass: process.env.EMAIL_PASSWORD, // Make sure to add this inside Vercel environment variables!
  },
});

export async function POST(req: Request) {
  try {
    const { formData, items, totalPrice, selectedPayment } = await req.json();

    const itemsListHtml = items
      .map((item: any) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px 0;">${item.product.name}</td>
          <td style="padding: 12px 0; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px 0; text-align: right;">$${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</td>
        </tr>
      `)
      .join('');

    const emailStyle = `
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #334155;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    `;

    // 1. Send Email to Admins (Internal)
    // User requested notifications to both office@metrolean.com and personal email
    await transporter.sendMail({
      from: '"Metrolean Pharmacy" <office@metrolean.com>',
      to: 'office@metrolean.com, mbahdilan2006@gmail.com',
      subject: `[Clinical Order] New Request from ${formData.name}`,
      html: `
        <div style="${emailStyle}">
          <h1 style="color: #0066cc; font-size: 24px; margin-bottom: 24px;">New Clinical Order Alert</h1>
          <p><strong>Patient/Client:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>Delivery Address:</strong> ${formData.address}, ${formData.city}, ${formData.zip}, ${formData.country}</p>
          <p><strong>Payment Method:</strong> ${selectedPayment}</p>
          
          <h2 style="font-size: 18px; margin-top: 32px; color: #1e293b;">Order Inventory</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="text-align: left; border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 14px;">
                <th style="padding-bottom: 8px;">Product</th>
                <th style="padding-bottom: 8px; text-align: center;">Qty</th>
                <th style="padding-bottom: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHtml}
            </tbody>
          </table>
          
          <div style="margin-top: 24px; text-align: right;">
            <p style="font-size: 18px; font-weight: bold; color: #0066cc;">Calculated Total: $${totalPrice.toFixed(2)}</p>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          <p style="font-size: 14px; color: #64748b; background: #f8fafc; padding: 15px; border-radius: 8px;">
            <strong>Metrolean Protocol:</strong> Please review this request against available stock and send the clinical payment confirmation to the client.
          </p>
        </div>
      `,
    });

    // 2. Send Confirmation Email to Customer
    await transporter.sendMail({
      from: '"Metrolean Pharmacy" <office@metrolean.com>',
      to: formData.email,
      subject: 'Order Acknowledgment - Metrolean Pharmacy',
      html: `
        <div style="${emailStyle}">
          <div style="text-align: center; margin-bottom: 32px;">
             <h1 style="color: #0066cc; font-size: 28px; margin: 0;">Metrolean Pharmacy</h1>
             <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Premium Healthcare Solutions</p>
          </div>
          
          <p>Hello ${formData.name},</p>
          <p>This is to acknowledge that we have received your clinical request. Our team is currently reviewing your order for pharmaceutical compliance and availability.</p>
          
          <div style="background: #f1f5f9; padding: 24px; border-radius: 16px; margin: 32px 0;">
            <h3 style="margin-top: 0; font-size: 16px; color: #1e293b;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
               ${itemsListHtml}
            </table>
            <p style="text-align: right; font-weight: bold; font-size: 18px; color: #0066cc; margin-top: 20px;">
              Total amount: $${totalPrice.toFixed(2)}
            </p>
          </div>
          
          <p><strong>Next Steps:</strong></p>
          <p>You will receive a follow-up via <strong>WhatsApp</strong> or <strong>Email</strong> shortly with final payment instructions and delivery timelines.</p>
          
          <p style="margin-top: 48px; border-top: 1px solid #e2e8f0; padding-top: 24px;">
            Best regards,<br />
            <strong>Clinical Operations Team</strong><br />
            Metrolean Pharmacy Solutions
          </p>
          
          <div style="text-align: center; margin-top: 32px; font-size: 12px; color: #94a3b8;">
            <p>© ${new Date().getFullYear()} Metrolean Pharmacy. All pharmaceutical orders are subject to professional verification.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json({ success: false, error: 'Failed to send notifications' }, { status: 500 });
  }
}
