import nodemailer from 'nodemailer';

// Validate environment variables on startup
const requiredEnvVars = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'EMAIL_FROM_NAME',
  'EMAIL_FROM_ADDRESS'
];

console.log('\n=== 📧 Checking Email Configuration ===');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:');
  missingVars.forEach(varName => console.error(`- ${varName}`));
  console.error('\nPlease set these variables in your environment configuration.');
  process.exit(1);
}

// Log email configuration (safely)
console.log('SMTP Settings:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: '********'
  },
  from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`
});

// Create transporter with enhanced debug options
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true,
  logger: true,
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production'
  }
});

// Verify transporter configuration on startup with detailed error logging
transporter.verify()
  .then(() => {
    console.log('✅ SMTP connection verified successfully');
    console.log(`Connected to ${process.env.SMTP_HOST} on port ${process.env.SMTP_PORT}`);
  })
  .catch((error) => {
    console.error('\n=== ❌ SMTP Connection Verification Failed ===');
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response,
    });
    console.error('\nPlease check your SMTP configuration and credentials.');
    process.exit(1);
  });

export const sendVerificationEmail = async (
  to: string,
  name: string,
  verificationUrl: string
) => {
  console.log('\n=== 📧 Starting Email Send Process ===');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Configuration:', {
    to,
    name,
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true'
  });

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
    console.log('\n=== ✅ Email Sent Successfully ===');
    console.log('Message details:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
      pending: info.pending,
      envelope: info.envelope
    });
    return info;
  } catch (error: any) {
    console.error('\n=== ❌ Email Sending Error ===');
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response,
      stack: error.stack
    });
    
    // Additional SMTP error information
    if (error.code === 'ECONNECTION' || error.code === 'EAUTH') {
      console.error('\nPossible causes:');
      console.error('- Incorrect SMTP credentials');
      console.error('- SMTP host not accessible');
      console.error('- Network connectivity issues');
      console.error('- Firewall blocking SMTP port');
    }
    
    throw error;
  }
};