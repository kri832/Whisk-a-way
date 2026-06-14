const nodemailer = require('nodemailer');

// Create transporter
let transporter;
let isEthereal = false;

// Initialize transporter - use Ethereal for development
const initTransporter = async () => {
  if (process.env.NODE_ENV === 'production') {
    // Production - use real SMTP
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else if (process.env.EMAIL_SERVICE === 'ethereal') {
    // Development - Use Ethereal (fake SMTP service)
    try {
      console.log('⏳ Initializing Ethereal email service...');
      // Add a race to prevent hanging indefinitely
      const testAccount = await Promise.race([
        nodemailer.createTestAccount(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Ethereal timeout')), 10000)),
      ]);
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      isEthereal = true;
      console.log('✅ Ethereal email service initialized for development');
      console.log('📬 Preview emails at: https://ethereal.email');
    } catch (error) {
      console.error('⚠️  Ethereal initialization failed:', error.message);
      console.log('📝 Falling back to MOCK email mode');
      transporter = null;
    }
  } else {
    // Development - Mock mode (default)
    console.log('📧 MOCK email mode activated (emails will be logged to console)');
    transporter = null;
  }
};

// Initialize on module load
initTransporter().catch(err => console.error('Failed to initialize email transporter:', err));

/**
 * Send verification email to user
 * @param {string} userEmail - User's email address
 * @param {string} token - Verification token
 */
const sendVerificationEmail = async (userEmail, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: 'Verify Your Email - Whisk-a-Way',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 32px;">Whisk-a-Way</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px; font-style: italic;">Beyond the plate</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Verify Your Email Address</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Welcome to Whisk-a-Way! To complete your registration and start exploring our curated menu, 
            please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 40px; 
                      text-decoration: none; 
                      border-radius: 50px; 
                      font-size: 18px; 
                      font-weight: bold;
                      display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Or copy and paste this link into your browser:
          </p>
          <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #667eea;">
            ${verificationLink}
          </p>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            This verification link will expire in 24 hours. If you did not create an account, 
            please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            &copy; ${new Date().getFullYear()} Whisk-a-Way. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    // Mock mode - just log the email
    if (!transporter) {
      console.log('\n' + '='.repeat(80));
      console.log('📧 MOCK EMAIL (Development Mode)');
      console.log('='.repeat(80));
      console.log(`To: ${userEmail}`);
      console.log(`Subject: Verify Your Email - Whisk-a-Way`);
      console.log(`Verification Link: ${verificationLink}`);
      console.log('='.repeat(80) + '\n');
      return true;
    }

    const result = await transporter.sendMail(mailOptions);
    
    // For Ethereal, log the preview URL
    if (isEthereal) {
      const previewUrl = nodemailer.getTestMessageUrl(result);
      console.log(`✅ Verification email sent to ${userEmail}`);
      console.log(`🔍 Preview email at: ${previewUrl}`);
    } else {
      console.log(`✅ Verification email sent to ${userEmail}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
};
