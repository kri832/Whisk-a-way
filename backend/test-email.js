require('dotenv').config();
const { sendVerificationEmail } = require('./utils/email');

// Test email sending
const testEmail = async () => {
  try {
    console.log('🧪 Testing email verification...');
    const testToken = 'test-token-12345';
    const testUserEmail = 'test@example.com';
    
    await sendVerificationEmail(testUserEmail, testToken);
    
    console.log('✅ Email test successful!');
    console.log('📬 Check the backend terminal for the Ethereal preview URL');
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
  }
};

testEmail();
