import nodemailer from 'nodemailer';

// Log email configuration on startup
console.log('\n=== 📧 Email Service Configuration ===');
console.log('SMTP Settings:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: '[REDACTED]'
  }
});

// Create transporter with debug enabled
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true,
  logger: true
});

// Verify transporter configuration on startup
transporter.verify()
  .then(() => {
    console.log('✅ SMTP connection verified successfully');
  })
  .catch((error) => {
    console.error('❌ SMTP connection verification failed:', error);
  });

export const sendVerificationEmail = async (
  to: string,
  name: string,
  verificationUrl: string
) => {
  console.log('\n=== 📧 Sending Verification Email ===');
  console.log('To:', to);
  console.log('Name:', name);
  console.log('Verification URL:', verificationUrl);
  console.log('From:', `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`);

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Email configuration is incomplete. Please check your environment variables.');
  }

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
    to,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px; text-align: center;">Welcome to SpeakUp!</h2>
          <p style="color: #555; font-size: 16px;">Hi ${name},</p>
          <p style="color: #555; font-size: 16px;">Thank you for registering. Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block; font-size: 16px; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
          <p style="color: #666; font-size: 14px; word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">This link will expire in 24 hours.</p>
          <p style="color: #666; font-size: 14px;">If you did not create an account, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 14px; text-align: center; margin: 0;">Best regards,<br>The SpeakUp Team</p>
        </div>
      </div>
    `,
  };

  try {
    console.log('📤 Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('=== ✨ Email Sending Complete ===\n');
    return info;
  } catch (error: any) {
    console.error('\n=== ❌ Email Sending Error ===');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    throw error;
  }
};