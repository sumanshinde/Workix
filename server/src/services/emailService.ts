import nodemailer from 'nodemailer';

// Configure transporter (placeholder for SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT) || 2525,
  auth: {
    user: process.env.SMTP_USER || 'placeholder',
    pass: process.env.SMTP_PASS || 'placeholder',
  },
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"GigIndia Support" <support@GigIndia.com>',
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    });
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (err) {
    console.error('Email sending failed:', err);
  }
};

export const notifyPaymentSuccess = async (email: string, amount: number) => {
  await sendEmail(
    email,
    'Payment Successful - GigIndia',
    `Your payment of ₹${amount} has been successfully added to escrow.`,
    `<h1>Payment Verified</h1><p>Your payment of <b>₹${amount}</b> is now securely held in escrow.</p>`
  );
};

export const notifyPayoutProcessed = async (email: string, amount: number) => {
  await sendEmail(
    email,
    'Payout Processed - GigIndia',
    `Good news! Your payout of ₹${amount} has been processed and sent to your bank account.`,
    `<h1>Earnings Withdrawn</h1><p>₹${amount} has been successfully transferred to your bank account.</p>`
  );
};
