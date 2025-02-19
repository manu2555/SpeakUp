import nodemailer from 'nodemailer';

// Validate environment variables on startup
const requiredEnvVars = [
  'SMTP_USER',
  'SMTP_PASS',
  'EMAIL_FROM_NAME',
  'EMAIL_FROM_ADDRESS'
];

console.log('\n=== 📧 Checking Email Configuration ===');
console.log('Environment:', process.env.NODE_ENV);

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:');
  missingVars.forEach(varName => console.error(`- ${varName}`));
  console.error('\nPlease set these variables in your environment configuration.');
  process.exit(1);
}

// Create production-specific transporter configuration
const transportConfig = {
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true,
  logger: true,
  // Production-specific settings
  pool: true, // Use pooled connections
  maxConnections: 3, // Limit concurrent connections
  rateDelta: 1000, // Minimum time between messages
  rateLimit: 3, // Maximum messages per rateDelta
  secure: false, // Use TLS
  tls: {
    rejectUnauthorized: true, // Verify SSL certificates
    ciphers: 'SSLv3', // Use strong ciphers
  },
  connectionTimeout: 10000, // 10 seconds
};

// Log email configuration (safely)
console.log('Email Configuration:', {
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: '********'
  },
  from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
  environment: process.env.NODE_ENV
});

// Create transporter with enhanced debug options
const transporter = nodemailer.createTransport(transportConfig);

// Verify transporter configuration on startup with detailed error logging
transporter.verify()
  .then(() => {
    console.log('✅ SMTP connection verified successfully');
    console.log('Connected to Gmail SMTP server');
    console.log('Transporter pool is ready to send messages');
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
    
    if (process.env.NODE_ENV === 'production') {
      console.error('\nProduction-specific troubleshooting:');
      console.error('1. Verify Render environment variables are set correctly');
      console.error('2. Check if Gmail account has 2FA and App Password');
      console.error('3. Verify no IP restrictions on Gmail account');
      console.error('4. Check Render service IP is not blocked');
    }
    
    process.exit(1);
  });

export const sendVerificationEmail = async (
  to: string,
  name: string,
  verificationUrl: string
) => {
  try {
    console.log('\n=== 📧 Starting Email Send Process ===');
    console.log('Send Configuration:', {
      to,
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
      environment: process.env.NODE_ENV
    });

    // Add retry logic for production
    const maxRetries = process.env.NODE_ENV === 'production' ? 3 : 1;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
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
          text: `
            Welcome to SpeakUp!
            
            Hi ${name},
            
            Thank you for registering. Please click the link below to verify your email address:
            
            ${verificationUrl}
            
            This link will expire in 24 hours.
            
            If you did not create an account, please ignore this email.
            
            Best regards,
            The SpeakUp Team
          `,
        };

        console.log(`📤 Attempting to send email (attempt ${attempt}/${maxRetries})...`);
        const info = await transporter.sendMail(mailOptions);
        console.log('\n=== ✅ Email Sent Successfully ===');
        console.log('Message details:', {
          messageId: info.messageId,
          response: info.response,
          accepted: info.accepted,
          rejected: info.rejected,
          attempt
        });
        return info;
      } catch (err) {
        lastError = err;
        console.error(`\n❌ Attempt ${attempt}/${maxRetries} failed:`, err.message);
        if (attempt < maxRetries) {
          const delay = attempt * 1000; // Increasing delay between retries
          console.log(`Waiting ${delay}ms before next attempt...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // If all retries failed, throw the last error
    throw lastError;
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
    
    if (process.env.NODE_ENV === 'production') {
      console.error('\nProduction-specific error information:');
      console.error('Environment:', process.env.NODE_ENV);
      console.error('Service:', 'gmail');
      console.error('User:', process.env.SMTP_USER);
      
      if (error.code === 'EAUTH') {
        console.error('\nAuthentication Error Troubleshooting:');
        console.error('1. Verify App Password is correct');
        console.error('2. Check if Gmail account has hit sending limits');
        console.error('3. Verify no suspicious activity blocks');
      } else if (error.code === 'ESOCKET') {
        console.error('\nConnection Error Troubleshooting:');
        console.error('1. Check Render service networking');
        console.error('2. Verify no IP blocks from Gmail');
        console.error('3. Check for rate limiting');
      }
    }
    
    throw error;
  }
};