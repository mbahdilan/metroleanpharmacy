import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Initialize Resend with a placeholder. 
// USER: Please update this in your .env.local file as RESEND_API_KEY=re_your_key
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function POST(req: Request) {
  try {
    const { formData, items, totalPrice, selectedPayment } = await req.json();

    const itemsListHtml = items
      .map((item: any) => `<li>${item.quantity}x ${item.product.name} - $${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</li>`)
      .join('');

    // 1. Send Email to Admin
    await resend.emails.send({
      from: 'Metrolean Pharmacy <orders@resend.dev>',
      to: 'broomuhams@gmail.com',
      subject: `New Order Received - ${formData.name}`,
      html: `
        <h1>New Order Alert</h1>
        <p><strong>Patient Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Address:</strong> ${formData.address}, ${formData.city}, ${formData.zip}, ${formData.country}</p>
        <p><strong>Payment Method Selected:</strong> ${selectedPayment}</p>
        
        <h2>Order Inventory</h2>
        <ul>${itemsListHtml}</ul>
        <p><strong>Total Cost: $${totalPrice.toFixed(2)}</strong></p>
        
        <hr />
        <p><em>Action Required: Please review and send payment instructions to the customer.</em></p>
      `,
    });

    // 2. Send Confirmation Email to Customer
    await resend.emails.send({
      from: 'Metrolean Pharmacy <orders@resend.dev>',
      to: formData.email,
      subject: 'Your Order is Being Processed - Metrolean Pharmacy',
      html: `
        <h1>Order Received</h1>
        <p>Hello ${formData.name},</p>
        <p>Thank you for your order with Metrolean Pharmacy. We have received your clinical request and are currently processing it.</p>
        
        <h3>Order Summary</h3>
        <ul>${itemsListHtml}</ul>
        <p><strong>Total: $${totalPrice.toFixed(2)}</strong></p>
        <p><strong>Payment Method:</strong> ${selectedPayment}</p>
        
        <p>Our clinical team will contact you shortly via WhatsApp or Email with the final payment instructions and delivery details.</p>
        
        <p>Best regards,<br />The Metrolean Team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json({ success: false, error: 'Failed to send notifications' }, { status: 500 });
  }
}
